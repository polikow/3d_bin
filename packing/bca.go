package packing

import (
	"errors"
	"fmt"
	"math"
	"math/rand"
)

var (
	ErrBCAInvalidParameter      = errors.New("invalid bca parameter value")
	ErrBCADone                  = errors.New("bca is done searching")
	ErrBCAFailedToCloneAntibody = errors.New("failed to clone antibody")
)

const clonalgIntensityCoefficient = 3

// BCA (B-Cell Algorithm) - алгоритм искусственной иммунной системы.
// Ориентирован на поиск глобального оптимума цф, имеющей сложный ландшафт.
//
// Алгоритм завершает свою работу, если в результате ni выполненных подряд
// итераций не было найдено лучшее решение.
//
// Интенсивность мутации зависит от числа итераций без улучшений.
// Чем больше итераций было выполнено без улучшений - тем больше интенсивность.
type BCA struct {
	searchState

	settings           BCASettings
	population         []Antibody
	populationAffinity []float64
	clones             []Antibody
	clonesAffinity     []float64
}

// BCASettings - параметры алгоритма
type BCASettings struct {
	Np     int        `json:"np"` // количество антител в популяции
	Ni     int        `json:"ni"` // максимальное число итераций без улучшений
	Ci     float64    `json:"ci"` // коэффициент интенсивности мутации
	Random *rand.Rand `json:"-"`  // генератор случайных чисел
}

// replaceWithDefaults создает новый экземпляр, который содержит все параметры
// текущего, за исключением тех, которые не заданы - такие задаются значениями
// по умолчанию.
func (s BCASettings) replaceWithDefaults() BCASettings {
	settings := s
	if settings.Np == 0 {
		settings.Np = 10
	}
	if settings.Ni == 0 {
		settings.Ni = 400
	}
	if settings.Ci == 0 {
		settings.Ci = 2.76
	}
	if settings.Random == nil {
		settings.Random = NewRandomSeeded()
	}
	return settings
}

// isSane проверяет корректность параметров алгоритма.
func (s BCASettings) isSane() (bool, error) {
	if s.Np <= 0 {
		return false, fmt.Errorf("%w: population = %v", ErrBCAInvalidParameter, s.Np)
	}
	if s.Ni <= 0 {
		return false, fmt.Errorf("%w: max iterations = %v", ErrBCAInvalidParameter, s.Ni)
	}
	if s.Ci <= 0 || s.Ci > 5 {
		return false, fmt.Errorf("%w: mutation intensity = %v", ErrBCAInvalidParameter, s.Ci)
	}
	if s.Random == nil {
		return false, fmt.Errorf("%w: random generator is nil", ErrBCAInvalidParameter)
	}
	return true, nil
}

// mustBeSane проверяет корректность параметров алгоритма. Если они некорректны,
// то вызывает panic.
func (s BCASettings) mustBeSane() {
	if _, err := s.isSane(); err != nil {
		panic(err)
	}
}

// NewBCA создает новый экземпляр иммунного алгоритма.
func NewBCA(task Task, settings BCASettings) *BCA {
	settings = settings.replaceWithDefaults()
	settings.mustBeSane()

	return &BCA{
		searchState: newSearchState(task),

		settings:           settings,
		population:         make([]Antibody, settings.Np),
		populationAffinity: make([]float64, settings.Np),
		clones:             make([]Antibody, settings.Np),
		clonesAffinity:     make([]float64, settings.Np),
	}
}

// Run выполняет одну итерацию алгоритма.
func (b *BCA) Run() SearchResult {
	if b.Done() {
		panic(ErrBCADone)
	} else {
		b.runIteration()
		return b.result()
	}
}

// Done проверяет, завершился ли алгоритм.
func (b *BCA) Done() bool {
	return b.iterationsNoImprovement >= b.settings.Ni || b.bestValueFound == 1
}

// Progress возвращает текущее состояние работы алгоритма.
func (b *BCA) Progress() Progress {
	if b.searchState.bestValueFound == 1 {
		return Progress{
			StepsDone:  b.iterationsPassed,
			StepsTotal: b.iterationsPassed,
		}
	}
	return Progress{
		StepsDone:  b.iterationsPassed,
		StepsTotal: b.iterationsPassed + b.settings.Ni - b.iterationsNoImprovement,
	}
}

// runIteration выполняет одну итерацию алгоритма.
func (b *BCA) runIteration() {
	if b.iterationsPassed == 0 {
		b.initializeAntibodies()   // (1)
		b.findPopulationAffinity() // (2)
	}
	b.cloneAndReplace() // (3)
	b.searchState.update(b.currentBest())
}

// cloneAndReplace выполняет клонирование и замену антител.
func (b *BCA) cloneAndReplace() {
	for i := range b.population {
		antibody := b.population[i]
		affinity := b.populationAffinity[i]

		b.createNpClones(antibody)

		// (4) мутирования случайного по схеме clonalg
		clone := b.selectRandomClone()
		intensity := math.Exp(-clonalgIntensityCoefficient * affinity)
		clone.mutate(b.settings.Random, intensity)

		// (5)
		intensity = (float64(b.iterationsNoImprovement)/float64(b.settings.Ni) + 0.01) * b.settings.Ci
		b.mutateClones(intensity)

		// (6)
		b.findClonesAffinity()
		bestClone, bestCloneAffinity := b.findBestClone()
		if bestCloneAffinity > affinity {
			copy(antibody, bestClone)
			b.populationAffinity[i] = bestCloneAffinity
		}
	}
}

// findBestClone находит наилучшего клона и его аффинность.
func (b *BCA) findBestClone() (Antibody, float64) {
	var (
		bestClone    = b.clones[0]
		bestAffinity = b.clonesAffinity[0]
	)
	for i, affinity := range b.clonesAffinity {
		if affinity > bestAffinity {
			bestAffinity = affinity
			bestClone = b.clones[i]
		}
	}
	return bestClone, bestAffinity
}

// mutateClones мутирует клоны с помощью операции гипермутации.
func (b *BCA) mutateClones(intensity float64) {
	for _, clone := range b.clones {
		clone.hypermutation(b.settings.Random, intensity)
	}
}

// createNpClones создает np клонов этого антитела.
func (b *BCA) createNpClones(antibody Antibody) {
	if b.iterationsPassed == 0 {
		for i := 0; i < b.settings.Np; i++ {
			clone := antibody.makeClone()
			b.clones[i] = clone
		}
	} else {
		for i := 0; i < b.settings.Np; i++ {
			dst := b.clones[i]
			antibody.makeCloneInDestination(dst)
		}
	}
}

// initializeAntibodies инициализирует популяцию антител.
func (b *BCA) initializeAntibodies() {
	for i := range b.population {
		b.population[i] = newAntibody(b.settings.Random, b.n)
	}
}

// findPopulationAffinity выполняет поиск аффинности антител популяции.
// (т.е. поиск значения целевой функции для каждого антитела)
func (b *BCA) findPopulationAffinity() {
	b.populationAffinity = b.populationAffinity[:0]
	for _, antibody := range b.population {
		affinity := b.findAffinity(antibody)
		b.populationAffinity = append(b.populationAffinity, affinity)
	}
}

// findPopulationAffinity выполняет поиск аффинности клонов.
// (т.е. поиск значения целевой функции для каждого клона)
func (b *BCA) findClonesAffinity() {
	b.clonesAffinity = b.clonesAffinity[:0]
	for _, antibody := range b.clones {
		affinity := b.findAffinity(antibody)
		b.clonesAffinity = append(b.clonesAffinity, affinity)
	}
}

// findAffinity выполняет поиск значения BG-аффинности для заданного тела.
func (b *BCA) findAffinity(antibody Antibody) float64 {
	return b.findFill(Solution(antibody))
}

// selectRandomClone возвращает случайное антитело из заданного набора антител.
func (b *BCA) selectRandomClone() Antibody {
	index := b.settings.Random.Intn(b.settings.Np)
	return b.clones[index]
}

// currentBest находит лучшее решение и цф на данной итерации.
func (b *BCA) currentBest() (Solution, float64) {
	var (
		bestAntibody = b.population[0]
		bestAffinity = b.populationAffinity[0]
	)
	for i := 0; i < b.settings.Np; i++ {
		affinity := b.populationAffinity[i]
		antibody := b.population[i]
		if affinity > bestAffinity {
			bestAffinity = affinity
			bestAntibody = antibody
		}
	}
	return Solution(bestAntibody), bestAffinity
}

// Antibody - антитело (решение задачи), в котором каждый ген состоит из:
//  index    - индекс размещаемого груза
//  rotation - вариант поворота груза
type Antibody Solution

// newAntibody создает новое случайное антитело.
func newAntibody(random *rand.Rand, size int) Antibody {
	return Antibody(newRandomSolution(random, size))
}

// makeClone создает клон текущего антитела.
func (a Antibody) makeClone() Antibody {
	clone := make([]IndexRotation, len(a))
	copy(clone, a)
	return clone
}

// makeClone создает клон текущего антитела в заданном участке памяти.
// (память должна быть выделена)
func (a Antibody) makeCloneInDestination(dst Antibody) Antibody {
	copied := copy(dst, a)
	if copied != len(a) {
		panic(ErrBCAFailedToCloneAntibody)
	}
	return dst
}

// mutate мутирует антитело.
func (a *Antibody) mutate(random *rand.Rand, intensity float64) {
	var (
		antibody = *a
		n        = len(antibody)

		m = ceilMultiplication(n, intensity) // всего мутаций
		p = random.Intn(m + 1)               // перестановок
		c = m - p                            // изменений поворота
	)

	// выполнение попарных перестановок
	for i := 0; i < p; i++ {
		x, y := intsInBounds(random, 0, n-1)
		antibody[x], antibody[y] = antibody[y], antibody[x]
	}

	// изменение поворотов
	for i := 0; i < c; i++ {
		x := random.Intn(n)
		antibody[x].Rotation = antibody[x].Rotation.newRandom(random)
	}
}

// hypermutation - оператор гипермутации.
// (мутация конкретной области гипермутации)
func (a *Antibody) hypermutation(random *rand.Rand, intensity float64) {
	var (
		antibody = *a
		n        = len(antibody)

		// область мутации
		lower, higher = intsInBoundsOrdered(random, 0, n-1) // границы
		areaSize      = higher - lower                      // размер

		m = ceilMultiplication(areaSize, intensity) // всего мутаций
		p = random.Intn(m + 1)                      // перестановок
		c = m - p                                   // изменений поворота
	)

	// выполнение попарных перестановок
	for i := 0; i < p; i++ {
		x, y := intsInBounds(random, lower, higher)
		antibody[x], antibody[y] = antibody[y], antibody[x]
	}

	// изменение поворотов
	for i := 0; i < c; i++ {
		x := intInBounds(random, lower, higher)
		antibody[x].Rotation = antibody[x].Rotation.newRandom(random)
	}
}

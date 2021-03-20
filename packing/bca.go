package packing

import (
	"fmt"
	"math"
	"math/rand"
	"time"
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

	//параметры алгоритма
	np int     // количество антител в популяции
	ni int     // максимальное число итераций без улучшений
	ci float64 // коэффициент интенсивности мутации

	population         []Antibody
	populationAffinity []float64
	clones             []Antibody
	clonesAffinity     []float64
}

func NewBCA(container Container, blocks []Block, np int, ni int, ci float64) *BCA {
	n := len(blocks)
	if np <= 0 || ni <= 0 || ci <= 0 || n == 0 {
		panic("wrong input values")
	}
	rand.Seed(time.Now().UTC().UnixNano())

	return &BCA{
		searchState: newSearchState(container, blocks),

		np: np,
		ni: ni,
		ci: ci,

		population:         make([]Antibody, np),
		populationAffinity: make([]float64, np),
		clones:             make([]Antibody, np),
		clonesAffinity:     make([]float64, np),
	}
}

func (b *BCA) Run() SearchResult {
	if b.Done() {
		panic("error")
	} else {
		b.runIteration()
		return b.bestResult()
	}
}

func (b *BCA) Done() bool {
	return b.iterationsNoImprovement >= b.ni || b.bestValueFound == 1
}

func (b *BCA) runIteration() {
	if b.iterationsPassed == 0 {
		b.initializeAntibodies()   // (1)
		b.findPopulationAffinity() // (2)
	}
	b.cloneAndReplace() // (3)
	b.searchState.update(b.currentBest())
}

func (b *BCA) cloneAndReplace() {
	for i := range b.population {
		antibody := b.population[i]
		affinity := b.populationAffinity[i]

		b.createNpClones(antibody)

		// (4) мутирования случайного по схеме clonalg
		clone := b.selectRandomClone()
		intensity := math.Exp(-clonalgIntensityCoefficient * affinity)
		clone.mutate(intensity)

		// (5)
		intensity = (float64(b.iterationsNoImprovement)/float64(b.ni) + 0.01) * b.ci
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

//findBestClone находит наилучшего клона и его аффинность.
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

//mutateClones - мутирование клонов с помощью операции гипермутации.
func (b *BCA) mutateClones(intensity float64) {
	for _, clone := range b.clones {
		clone.hypermutation(intensity)
	}
}

//createNpClones - создание np клонов.
func (b *BCA) createNpClones(antibody Antibody) {
	if b.iterationsPassed == 0 {
		for i := 0; i < b.np; i++ {
			clone := antibody.makeClone()
			b.clones[i] = clone
		}
	} else {
		for i := 0; i < b.np; i++ {
			dst := b.clones[i]
			antibody.makeCloneInDestination(dst)
		}
	}
}

//initializeAntibodies - инициализация популяции антител.
func (b *BCA) initializeAntibodies() {
	for i := range b.population {
		b.population[i] = newAntibody(b.n)
	}
}

//findPopulationAffinity - поиск аффинности антител популяции.
//(т.е. поиск значения целевой функции для каждого антитела)
func (b *BCA) findPopulationAffinity() {
	b.populationAffinity = b.populationAffinity[:0]
	for _, antibody := range b.population {
		affinity := b.findAffinity(antibody)
		b.populationAffinity = append(b.populationAffinity, affinity)
	}
}

//findPopulationAffinity - поиск аффинности клонов.
//(т.е. поиск значения целевой функции для каждого клона)
func (b *BCA) findClonesAffinity() {
	b.clonesAffinity = b.clonesAffinity[:0]
	for _, antibody := range b.clones {
		affinity := b.findAffinity(antibody)
		b.clonesAffinity = append(b.clonesAffinity, affinity)
	}
}

//findAffinity - поиск значения BG-аффинности для заданного тела.
func (b BCA) findAffinity(antibody Antibody) float64 {
	packed := b.packAlgorithm.Run(Solution(antibody))

	packedVolume := blockPositionsVolume(packed)

	return float64(packedVolume) / b.containerVolume
}

//selectRandomClone возвращает случайное антитело из заданного набора антител.
func (b BCA) selectRandomClone() Antibody {
	return b.clones[rand.Intn(b.np)]
}

// currentBest - лучшее решение и цф на данной итерации.
func (b BCA) currentBest() (Solution, float64) {
	var (
		bestAntibody = b.population[0]
		bestAffinity = b.populationAffinity[0]
	)
	for i := 0; i < b.np; i++ {
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
//  index    - индекс размещаемого блока
//  rotation - вариант поворота блока
type Antibody Solution

// newAntibody создает новое случайное антитело.
// Для создания случайных перестановок используется алгоритм Фишера-Йетса.
func newAntibody(size int) Antibody {
	return Antibody(randomSolution(size))
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
		panic(fmt.Sprintf(
			"couldn't clone into dst. copied %v values instead of %v",
			copied, len(a)))
	}
	return dst
}

// mutate мутирует антитело.
func (a *Antibody) mutate(intensity float64) {
	var (
		antibody = *a
		n        = len(antibody)

		m = int(math.Ceil(float64(n) * intensity)) // всего мутаций
		p = rand.Intn(m + 1)                       // перестановок
		c = m - p                                  // изменений поворота
	)

	// выполнение попарных перестановок
	for i := 0; i < p; i++ {
		x, y := twoRandomInBounds(0, n-1)
		antibody[x], antibody[y] = antibody[y], antibody[x]
	}

	// изменение поворотов
	for i := 0; i < c; i++ {
		x := rand.Intn(n)
		antibody[x].Rotation = antibody[x].Rotation.newRandom()
	}
}

// hypermutation - оператор гипермутации.
// (мутация конкретной области гипермутации)
func (a *Antibody) hypermutation(intensity float64) {
	var (
		antibody = *a
		n        = len(antibody)

		lower    = rand.Intn(n - 1)                 // нижняя граница области
		higher   = rand.Intn(n-lower-1) + lower + 1 // верхняя граница
		areaSize = higher - lower                   // размер выбранной области

		m = int(math.Ceil(float64(areaSize) * intensity)) // всего мутаций
		p = rand.Intn(m + 1)                              // перестановок
		c = m - p                                         // изменений поворота
	)

	// выполнение попарных перестановок
	for i := 0; i < p; i++ {
		x, y := twoRandomInBounds(lower, higher)
		antibody[x], antibody[y] = antibody[y], antibody[x]
	}

	// изменение поворотов
	for i := 0; i < c; i++ {
		x := randomInBounds(lower, higher)
		antibody[x].Rotation = antibody[x].Rotation.newRandom()
	}
}

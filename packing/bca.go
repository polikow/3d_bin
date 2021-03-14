package packing

import (
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

	//параметры алгоритма
	container Container
	blocks    []Block
	np        int     // количество антител в популяции
	ni        int     // максимальное число итераций без улучшений
	ci        float64 // коэффициент интенсивности мутации

	n                  int // размер задачи
	containerVolume    float64
	packAlgorithm      *PackAlgorithm
	population         []Antibody
	populationAffinity []float64
	clones             []Antibody
	clonesAffinity     []float64

	bestValueFound              float64
	bestSolutionFound           Solution
	bestPackedFound             []BlockPosition
	iterationsPassed            int
	iterationsWithNoImprovement int
}

func NewBCA(container Container, blocks []Block, np int, ni int, ci float64) *BCA {
	n := len(blocks)
	if np <= 0 || ni <= 0 || ci <= 0 || n == 0 {
		panic("wrong input values")
	}
	rand.Seed(time.Now().UTC().UnixNano())

	return &BCA{
		container: container,
		blocks:    blocks,
		np:        np,
		ni:        ni,
		ci:        ci,

		n:                  n,
		containerVolume:    float64(container.Volume()),
		packAlgorithm:      NewPackAlgorithm(container, blocks),
		population:         make([]Antibody, np),
		populationAffinity: make([]float64, np),
		clones:             make([]Antibody, np),
		clonesAffinity:     make([]float64, np),

		bestValueFound:              0,
		bestSolutionFound:           make(Solution, n),
		bestPackedFound:             make([]BlockPosition, n),
		iterationsPassed:            0,
		iterationsWithNoImprovement: 0,
	}
}

func (b *BCA) Run() SearchResult {
	if b.Done() {
		panic("error")
	}

	b.runIteration()

	return SearchResult{
		Iteration: b.iterationsPassed,
		Value:     b.bestValueFound,
		Solution:  b.bestSolutionFound,
		Packed:    b.bestPackedFound,
	}
}

func (b *BCA) Done() bool {
	return b.iterationsWithNoImprovement >= b.ni || b.bestValueFound == 1
}

func (b *BCA) runIteration() {
	if b.iterationsPassed == 0 {
		b.initializeAntibodies()   // (1)
		b.findPopulationAffinity() // (2)
	}
	b.cloneAndReplace() // (3)
	b.updateSearchState()
}

func (b *BCA) cloneAndReplace() {
	for i := range b.population {
		antibody := b.population[i]
		affinity := b.populationAffinity[i]

		b.createNpClones(antibody)

		// (4) мутирования случайного по схеме clonalg
		randomClone := b.selectRandomClone()
		clonalgIntensity := math.Exp(-clonalgIntensityCoefficient * affinity)
		randomClone.mutate(clonalgIntensity)

		// (5)
		intensity := (float64(b.iterationsWithNoImprovement)/float64(b.ni) + 0.01) * b.ci
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

func (b *BCA) updateSearchState() {
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

	if b.bestValueFound < bestAffinity {
		b.bestValueFound = bestAffinity

		copy(b.bestSolutionFound, bestAntibody)

		packed := b.packAlgorithm.Run(b.bestSolutionFound)
		b.bestPackedFound = append(b.bestPackedFound[:0], packed...)

		b.iterationsWithNoImprovement = 0
	} else {
		b.iterationsWithNoImprovement++
	}

	b.iterationsPassed++
}

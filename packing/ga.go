package packing

import (
	"math"
	"math/rand"
	"sort"
)

type Evolution interface {
	runSelection(g *GA)
}

// Выбор родителей происходит с помощью турнира размера 3.
type DarwinEvolution struct{}

func (DarwinEvolution) runSelection(g *GA) {
	const elite float64 = 0.05

	type pair struct {
		chromosome Chromosome
		fitness    float64
	}

	var (
		n  = g.np                               // хромосом в популяции
		ne = int(math.Ceil(elite * float64(n))) // количество элитных хромосом
		nn = n - ne                             // количество дочерних
		np = nn + (nn % 2)                      // количество родительских

		newPopulation = make([]Chromosome, 0, n)
		newFitness    = make([]float64, 0, n)

		parents = make([]Chromosome, 0, np)
		rivals  = [3]pair{}
	)

	// сортировка хромосом популяции по значению приспособленности
	pairs{c: g.population, f: g.populationFitness}.sort()

	// элитные хромосомы становятся частью новой популяции
	for i := 0; i < ne; i++ {
		var (
			chromosome = g.population[i]
			fitness    = g.populationFitness[i]
		)
		newPopulation = append(newPopulation, chromosome)
		newFitness = append(newFitness, fitness)
	}

	// выбор родителей
	for len(parents) != cap(parents) {
		for i := range rivals {
			j := rand.Intn(n)
			rivals[i] = pair{
				chromosome: g.population[j],
				fitness:    g.populationFitness[j],
			}
		}

		// наиболее приспособленная особь становиться родительской
		best := rivals[0]
		for _, rival := range rivals {
			if rival.fitness > best.fitness {
				best = rival
			}
		}
		parents = append(parents, best.chromosome)
	}

	// скрещивание
	for len(newPopulation) != cap(newPopulation) {
		i := len(newPopulation)
		parent1 := parents[i]
		parent2 := parents[i+1]
		child1, child2 := Chromosome.crossover(parent1, parent2)
	}

	// мутация новой популяции
	for _, chromosome := range newPopulation {
		chromosome.mutate()
	}

	panic("implement me")
}

type pairs struct {
	c []Chromosome
	f []float64
}

func (p pairs) Len() int { return len(p.c) }

func (p pairs) Less(i, j int) bool { return p.f[i] < p.f[j] }

func (p pairs) Swap(i, j int) {
	p.c[i], p.c[j] = p.c[j], p.c[i]
	p.f[i], p.f[j] = p.f[j], p.f[i]
}

func (p pairs) sort() {
	sort.Sort(sort.Reverse(p))
}

type GA struct {

	// входные параметры
	container Container
	blocks    []Block
	np        int       // размер популяции
	mp        float64   // вероятность мутации
	ni        int       // количество итераций без улучшений
	model     Evolution // модель эволюции

	n                 int           // размер задачи
	containerVolume   float64       // объем контейнера
	packAlgorithm     PackAlgorithm // алгоритм упаковки
	population        []Chromosome  // популяция хромосом
	populationFitness []float64     // приспособленность популяции

	bestValueFound              float64
	bestSolutionFound           Solution
	bestPackedFound             []BlockPosition
	iterationsPassed            int
	iterationsWithNoImprovement int
}

func (g *GA) Run() SearchResult {
	panic("implement me")
}

func (g *GA) Done() bool {
	panic("implement me")
}

func (g *GA) runIteration() {
	if g.iterationsPassed == 0 {
		g.initializePopulation()
		g.findPopulationFitness()
	}
	g.model.runSelection(g)
	g.mutatePopulation()
	g.updateSearchState()
}

func (g *GA) initializePopulation() {
	for i := range g.population {
		g.population[i] = newChromosome(g.n)
	}
}

func (g GA) findPopulationFitness() {
	g.populationFitness = g.populationFitness[0:]
	for _, chromosome := range g.population {
		fitness := g.findFitness(chromosome)
		g.populationFitness = append(g.populationFitness, fitness)
	}
}

func (g GA) findFitness(chromosome Chromosome) float64 {
	packed := g.packAlgorithm.Run(Solution(chromosome))

	packedVolume := blockPositionsVolume(packed)

	return float64(packedVolume) / g.containerVolume
}

func (g *GA) mutatePopulation() {
	for _, chromosome := range g.population {
		chromosome.mutate()
	}
}

func (g *GA) updateSearchState() {
	var (
		bestAntibody = g.population[0]
		bestAffinity = g.populationFitness[0]
	)
	for i := 0; i < g.np; i++ {
		affinity := g.populationFitness[i]
		antibody := g.population[i]
		if affinity > bestAffinity {
			bestAffinity = affinity
			bestAntibody = antibody
		}
	}

	if g.bestValueFound < bestAffinity {
		g.bestValueFound = bestAffinity

		copy(g.bestSolutionFound, bestAntibody)

		packed := g.packAlgorithm.Run(g.bestSolutionFound)
		g.bestPackedFound = append(g.bestPackedFound[:0], packed...)

		g.iterationsWithNoImprovement = 0
	} else {
		g.iterationsWithNoImprovement++
	}

	g.iterationsPassed++
}

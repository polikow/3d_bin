package packing

import (
	"fmt"
	"math/rand"
	"sort"
)

type GA struct {
	searchState

	// входные параметры
	np        int        // размер популяции
	mp        float64    // вероятность мутации
	ni        int        // количество итераций без улучшений
	evolution Evolution  // модель эволюции
	random    *rand.Rand // генератор случайных чисел

	population        []Chromosome // популяция хромосом
	populationFitness []float64    // приспособленность популяции
}

func NewGA(container Container, blocks []Block, np int, mp float64, ni int, evolution Evolution, random *rand.Rand) *GA {
	if np <= 0 || mp <= 0 || mp > 1 || ni <= 0 || evolution == nil {
		panic("ga: wrong input values")
	}

	return &GA{
		searchState: newSearchState(container, blocks),

		np:        np,
		mp:        mp,
		ni:        ni,
		evolution: evolution,
		random:    random,

		population:        make([]Chromosome, np),
		populationFitness: make([]float64, 0, np),
	}
}

func (g *GA) Run() SearchResult {
	if g.Done() {
		panic("error")
	} else {
		g.runIteration()
		return g.result()
	}
}

func (g *GA) Done() bool {
	return g.iterationsNoImprovement >= g.ni || g.bestValueFound == 1
}

func (g *GA) runIteration() {
	if g.iterationsPassed == 0 {
		g.initializePopulation()
		g.findPopulationFitness()
	}
	g.evolution.runSelection(g)
	g.mutatePopulation()
	g.findPopulationFitness()
	g.searchState.update(g.currentBest())
}

func (g *GA) initializePopulation() {
	for i := range g.population {
		g.population[i] = newChromosome(g.random, g.n)
	}
}

func (g *GA) findPopulationFitness() {
	for i := len(g.populationFitness); i < cap(g.populationFitness); i++ {
		chromosome := g.population[i]
		fitness := g.findFitness(chromosome)
		g.populationFitness = append(g.populationFitness, fitness)
	}
}

func (g GA) findFitness(chromosome Chromosome) float64 {
	return g.findFill(Solution(chromosome))
}

func (g *GA) mutatePopulation() {
	for _, chromosome := range g.population {
		if g.random.Float64() <= g.mp {
			chromosome.mutate(g.random)
		}
	}
}

func (g GA) currentBest() (Solution, float64) {
	var (
		bestChromosome = g.population[0]
		bestFitness    = g.populationFitness[0]
	)
	for i := 0; i < g.np; i++ {
		fitness := g.populationFitness[i]
		chromosome := g.population[i]
		if fitness > bestFitness {
			bestFitness = fitness
			bestChromosome = chromosome
		}
	}
	return Solution(bestChromosome), bestFitness
}

type Chromosome Solution

// newChromosome создает новую случайную хромосому.
func newChromosome(random *rand.Rand, size int) Chromosome {
	return Chromosome(newRandomSolution(random, size))
}

var emptyIndexRotation = IndexRotation{-1, 0}

func newEmptyChromosome(size int) Chromosome {
	chromosome := make(Chromosome, size)
	for i := range chromosome {
		chromosome[i] = emptyIndexRotation
	}
	return chromosome
}

// mutate мутирует хромосому.
func (c *Chromosome) mutate(random *rand.Rand) {
	var (
		chromosome = *c
		n          = len(chromosome)

		m  = ceilDivision(n, 4) // всего мутаций
		p  = random.Intn(m + 1) // перестановок
		ch = m - p              // изменений поворота
	)

	// выполнение попарных перестановок
	for i := 0; i < p; i++ {
		x, y := intsInBounds(random, 0, n-1)
		chromosome[x], chromosome[y] = chromosome[y], chromosome[x]
	}

	// изменение поворотов
	for i := 0; i < ch; i++ {
		x := random.Intn(n)
		chromosome[x].Rotation = chromosome[x].Rotation.newRandom(random)
	}
}

// crossover - операция кроссинговера хромосом.(двойной кроссинговер)(PMX)
func (c Chromosome) crossover(c2 Chromosome, random *rand.Rand) (Chromosome, Chromosome) {
	var (
		parent1 = c
		parent2 = c2
		n       = len(parent1)

		child1 = newEmptyChromosome(n)
		child2 = newEmptyChromosome(n)
	)

	// (1)
	start, end := intsInBounds(random, 0, n)
	if start > end {
		start, end = end, start
	}

	// (2)
	copy(child1[start:end], parent2[start:end])
	copy(child2[start:end], parent1[start:end])

	// (3) заполнение тех, которых нет в [start, end]
	fillWithNoConflict(child1, parent1, start, end, n)
	fillWithNoConflict(child2, parent2, start, end, n)

	// (4) заполнение оставшихся
	fillConflicted(child1, parent1, parent2, start, end)
	fillConflicted(child2, parent2, parent1, start, end)

	return child1, child2
}

func fillWithNoConflict(child, parent Chromosome, start, end, n int) {
	for i := 0; i < start; i++ {
		value := parent[i]
		if contains(child[start:end], value) {
			continue
		} else {
			child[i] = value
		}
	}
	for i := end; i < n; i++ {
		value := parent[i]
		if contains(child[start:end], value) {
			continue
		} else {
			child[i] = value
		}
	}
}

func contains(s []IndexRotation, value IndexRotation) bool {
	for _, v := range s {
		if v.Index == value.Index {
			return true
		}
	}
	return false
}

func fillConflicted(child, originalP, otherP Chromosome, start, end int) {
	for i, indexRotation := range child {
		if indexRotation == emptyIndexRotation {
			o := originalP[i].Index // исходное значение на этой позиции
			child[i] = mapped(originalP[start:end], otherP[start:end], o)
		}
	}
}

// mapped - подходящее значение для конфликтной позиции.
//  originalP - 1й родитель для этой хромосомы,
//  otherP    - 2й родитель.
func mapped(originalP, otherP Chromosome, originalIndex int) IndexRotation {
	for i, value := range otherP {
		if value.Index == originalIndex {
			mappedValue := originalP[i]
			if contains(otherP, mappedValue) {
				return mapped(originalP, otherP, mappedValue.Index)
			} else {
				return mappedValue
			}
		}
	}
	panic("can't find mapped element")
}

// Evolution - модель эволюции.
//
// runSelection - селекция, в результате которой исходная популяция
// заменяется новой.
type Evolution interface {
	runSelection(g *GA)
	fmt.Stringer
}

// DarwinEvolution - модель эволюции по Дарвину.
type DarwinEvolution struct{}

func (DarwinEvolution) String() string { return "Darwin" }

func (DarwinEvolution) runSelection(g *GA) {
	const elite float64 = 0.05

	type pair struct {
		chromosome Chromosome
		fitness    float64
	}

	var (
		n  = len(g.population)            // хромосом в популяции
		ne = ceilMultiplication(n, elite) // количество элитных хромосом
		nn = n - ne                       // количество дочерних
		np = nn + (nn%2)*2                // количество родителей

		newPopulation = make([]Chromosome, 0, n) // новая популяция
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

	// выбор родителей происходит с помощью турнира размера 3.
	for len(parents) != cap(parents) {
		for i := range rivals {
			j := g.random.Intn(n)
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
	i := 0
	for len(newPopulation) != cap(newPopulation) {
		parent1 := parents[i]
		parent2 := parents[i+1]
		child1, child2 := Chromosome.crossover(parent1, parent2, g.random)

		newPopulation = append(newPopulation, child1)
		if len(newPopulation) != cap(newPopulation) {
			newPopulation = append(newPopulation, child2)
		}
		i++
	}

	g.population = newPopulation
	g.populationFitness = newFitness
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

//DeVriesEvolution - модель эволюции по де Фризу.
type DeVriesEvolution struct{}

func (DeVriesEvolution) String() string { return "DeVries" }

const (
	// вероятности возникновения катастрофы
	beforeProbability = 0.012 // перед селекцией
	afterProbability  = 0.018 // после селекции

	// количество погибших в катастрофе (%)
	minDeaths = 0.3
	maxDeaths = 0.8
)

func (DeVriesEvolution) catastrophe(g *GA, probability float64) {
	random := g.random
	if random.Float64() <= probability {
		var (
			n             = len(g.population)
			deathsPercent = float64InBounds(random, minDeaths, maxDeaths)
			deaths        = ceilMultiplication(n, deathsPercent)
		)
		//fmt.Printf("catastrophe at %d! deaths: %.2g (%d)\n", g.iterationsPassed, deathsPercent, deaths)

		for i := 0; i < deaths; i++ {
			j := random.Intn(g.np)
			chromosome := newChromosome(random, g.n)
			g.population[j] = chromosome
			// если у изначальной хромосомы было известно цф, то пересчитываем
			if len(g.populationFitness) > j {
				g.populationFitness[j] = g.findFitness(chromosome)
			}
		}
	}
}

func (d DeVriesEvolution) runSelection(g *GA) {
	d.catastrophe(g, beforeProbability)
	DarwinEvolution{}.runSelection(g)
	d.catastrophe(g, afterProbability)
}

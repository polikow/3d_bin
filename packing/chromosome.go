package packing

import "math/rand"

type Chromosome Solution

// newChromosome создает новую случайную хромосому.
// Для создания случайных перестановок используется алгоритм Фишера-Йетса.
func newChromosome(size int) Chromosome {
	genes := make([]IndexRotation, size)
	for i := range genes {
		genes[i].Index = i
	}

	for i := len(genes) - 1; i >= 0; i-- {
		j := rand.Intn(i + 1)
		if i != j {
			genes[j].Index, genes[i].Index = genes[i].Index, genes[j].Index
		}
	}
	for i := range genes {
		genes[i].Rotation = randomRotation()
	}
	return genes
}

// mutate мутирует хромосому.
func (c *Chromosome) mutate() {
	var (
		chromosome = *c
		n          = len(chromosome)

		m  = n / 4            // всего мутаций
		p  = rand.Intn(m + 1) // перестановок
		ch = m - p            // изменений поворота
	)

	// выполнение попарных перестановок
	for i := 0; i < p; i++ {
		x, y := twoRandomInBounds(0, n-1)
		chromosome[x], chromosome[y] = chromosome[y], chromosome[x]
	}

	// изменение поворотов
	for i := 0; i < ch; i++ {
		x := rand.Intn(n)
		chromosome[x].Rotation = chromosome[x].Rotation.newRandom()
	}
}

func (c Chromosome) crossover(parent2 Chromosome) (Chromosome, Chromosome) {

}

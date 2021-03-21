package packing

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestChromosomeCrossover(t *testing.T) {
	for i := 0; i < 100; i++ {
		c1 := newChromosome(5)
		c2 := newChromosome(5)
		child1, child2 := Chromosome.crossover(c1, c2)

		for i := range child1 {
			for j := range child1 {
				if i != j {
					assert.NotEqual(t, child1[i].Index, child1[j].Index)
				}
			}
		}
		for i := range child2 {
			for j := range child2 {
				if i != j {
					assert.NotEqual(t, child2[i], child2[j])
				}
			}
		}
		fmt.Println(c1)
		fmt.Println(c2)
		fmt.Println("--------------")
		fmt.Println(child1)
		fmt.Println(child2)
		fmt.Println()

	}
}

func TestGA(t *testing.T) {
	container := Container{Width: 3, Height: 4, Length: 3}
	blocks := []Block{
		{Width: 1, Height: 2, Length: 3},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 2, Length: 1},

		{Width: 2, Height: 2, Length: 1},
		{Width: 2, Height: 2, Length: 2},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 2, Length: 1},

		{Width: 2, Height: 2, Length: 1},
		{Width: 2, Height: 2, Length: 2},
	}
	ga := NewGA(container, blocks, 100, 0.2, 500, DarwinEvolution{})
	EvaluatePrintBetter(ga)
}

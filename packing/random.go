package packing

import (
	"math/rand"
	"time"
)

// NewRandom создает новый генератор случайных чисел с заданным seed значением.
func NewRandom(seed int64) *rand.Rand {
	return rand.New(rand.NewSource(seed).(rand.Source64))
}

// NewRandomSeeded создает новый генератор случайных чисел со seed значением,
// зависящим от текущего времени.
func NewRandomSeeded() *rand.Rand {
	return NewRandom(TimeSeed())
}

func TimeSeed() int64 {
	return time.Now().UnixNano()
}

// GenerateRandomBlocks случайным образом создает грузы для контейнера.
func GenerateRandomBlocks(random *rand.Rand, container Container) []Block {
	const (
		hugeBlockProbability = 0.05
		bigBlockProbability  = 0.15

		hugeMin, hugeMax   = 0.24, 0.38
		bigMin, bigMax     = 0.2, 0.3
		smallMin, smallMax = 0.05, 0.18
	)
	var (
		blocks []Block
		block  Block
	)

	for VolumeOf(blocks...) <= ceilMultiplicationUINT(VolumeOf(container), 1.2) {
		switch {
		case random.Float64() <= hugeBlockProbability:
			block = generateRandomBlock(random, container, hugeMin, hugeMax)
		case random.Float64() <= bigBlockProbability:
			block = generateRandomBlock(random, container, bigMin, bigMax)
		default:
			block = generateRandomBlock(random, container, smallMin, smallMax)
		}
		blocks = append(blocks, block)
	}
	return blocks
}

// generateRandomBlock создает груз со случайного размера.
func generateRandomBlock(random *rand.Rand, container Container, min float64, max float64) Block {
	return Block{
		Width:  ceilMultiplicationUINT(container.Width, float64InBounds(random, min, max)),
		Height: ceilMultiplicationUINT(container.Height, float64InBounds(random, min, max)),
		Length: ceilMultiplicationUINT(container.Length, float64InBounds(random, min, max)),
	}
}

// intInBounds генерирует случайное число, которое лежит на [lower, higher].
func intInBounds(random *rand.Rand, lower, higher int) int {
	return random.Intn(higher-lower+1) + lower
}

// intsInBounds генерирует пару случайных чисел a и b, которые:
//  1) лежат на отрезке [lower, higher]
//  2) a != b (отличны друг от друга)
func intsInBounds(random *rand.Rand, lower, higher int) (int, int) {
	var x, y int
	x = intInBounds(random, lower, higher)
	y = intInBounds(random, lower, higher)
	if x == y {
		if x == higher {
			y = lower
		} else {
			y++
		}
	}
	return x, y
}

// intsInBoundsOrdered генерирует пару случайных чисел a и b, которые:
//  1) лежат на отрезке [lower, higher]
//  2) a < b
func intsInBoundsOrdered(random *rand.Rand, lower, higher int) (int, int) {
	a, b := intsInBounds(random, lower, higher)
	if a > b {
		a, b = b, a
	}
	return a, b
}

// float64InBounds генерирует случайное вещественное число на [lower, higher).
func float64InBounds(random *rand.Rand, lower, higher float64) float64 {
	return lower + random.Float64()*(higher-lower)
}

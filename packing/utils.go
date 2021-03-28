package packing

import (
	"math"
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

// intInBounds генерирует случайное число, которое лежит на [lower, higher].
func intInBounds(random *rand.Rand, lower, higher int) int {
	return random.Intn(higher - lower + 1) + lower
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
//  2) a != b (отличны друг от друга)
//  3) a < b
func intsInBoundsOrdered(random *rand.Rand, lower, higher int) (int, int) {
	a, b := intsInBounds(random, lower, higher)
	if a > b {
		a, b = b, a
	}
	return a, b
}

// float64InBounds генерирует случайное вещественное число на [lower, higher).
func float64InBounds(random *rand.Rand, lower, higher float64) float64 {
	return lower + random.Float64() * (higher-lower)
}

func ceilMultiplication(i int, f float64) int {
	return int(math.Ceil(float64(i) * f))
}

func ceilMultiplicationUINT(u uint, f float64) uint {
	return uint(math.Ceil(float64(u) * f))
}

func ceilDivision(i int, f float64) int {
	return int(math.Ceil(float64(i) / f))
}
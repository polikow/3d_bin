package packing

import "math/rand"

// twoRandomInBounds генерирует пару случайных чисел, которые:
//  1) лежат на отрезке [lower, higher]
//  2) отличны друг от друга
func twoRandomInBounds(lower, higher int) (int, int) {
	x := randomInBounds(lower, higher)
	y := randomInBounds(lower, higher)
	if x == y {
		if x == higher {
			y = lower
		} else {
			y++
		}
	}
	return x, y
}

//randomInBounds генерирует случайное число, которое лежит на [lower, higher].
func randomInBounds(lower, higher int) int {
	return rand.Intn(higher - lower + 1) + lower
}
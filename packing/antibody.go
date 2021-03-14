package packing

import (
	"fmt"
	"math"
	"math/rand"
)

// Antibody - антитело (решение задачи), в котором каждый ген состоит из:
//  index    - индекс размещаемого блока
//  rotation - вариант поворота блока
type Antibody Solution

// newAntibody создает новое случайное антитело.
// Для создания случайных перестановок используется алгоритм Фишера-Йетса.
func newAntibody(size int) Antibody {
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

		lower    = rand.Intn(n - 1)                     // нижняя граница области
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
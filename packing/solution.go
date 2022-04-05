package packing

import "math/rand"

// Solution - порядок выполнения упаковки.
type Solution []IndexRotation

type IndexRotation struct {
	Index    int      `json:"index"`    // индекс размещаемого груза
	Rotation Rotation `json:"rotation"` // вариант поворота груза
}

// newRandomSolution - создание случайного решения.
// Для создания случайных перестановок используется алгоритм Фишера-Йетса.
func newRandomSolution(random *rand.Rand, size int) Solution {
	s := make(Solution, size)
	for i := range s {
		s[i].Index = i
	}

	for i := len(s) - 1; i >= 0; i-- {
		j := random.Intn(i + 1)
		if i != j {
			s[j].Index, s[i].Index = s[i].Index, s[j].Index
		}
	}
	for i := range s {
		s[i].Rotation = randomRotation(random)
	}

	return s
}

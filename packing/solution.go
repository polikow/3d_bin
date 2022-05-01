package packing

import (
	"errors"
	"fmt"
	"math/rand"
)

var ErrInvalidSolution = errors.New("invalid solution")

// Solution - порядок выполнения упаковки.
type Solution []IndexRotation

type IndexRotation struct {
	Index    int      `json:"index"`    // индекс размещаемого груза
	Rotation Rotation `json:"rotation"` // вариант поворота груза
}

// newRandomSolution создает случайное решение.
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

func (s *Solution) isSane(task Task) (bool, error) {
	if len(*s) != len(task.Blocks) {
		return false, fmt.Errorf("%w: solution length (%v) does not match the amount of blocks (%v)", ErrInvalidSolution, len(*s), len(task.Blocks))
	}
	for _, indexRotation := range *s {
		rotation := indexRotation.Rotation
		if rotation < XYZ || rotation > YXZ {
			return false, fmt.Errorf("%w: %s", ErrInvalidSolution, ErrInvalidAxis.Error())
		}
	}
	indexes := make(map[int]bool, len(*s))
	for _, indexRotation := range *s {
		indexes[indexRotation.Index] = true
	}
	for i := 0; i < len(indexes); i++ {
		if _, ok := indexes[i]; !ok {
			return false, fmt.Errorf("%w: index %v is not present", ErrInvalidSolution, i)
		}
	}
	return true, nil
}

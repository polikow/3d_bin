package packing

import (
	"errors"
	"math/rand"
)

var ErrInvalidRotation = errors.New("wrong rotation value")

// Rotation - вариант поворота груза.
//
// Груз является прямоугольным параллелепипедом, поэтому
// существует всего 6 вариантов его поворота.
//
// Расшифровка:
//  XYZ - широкая сторона параллельна оси X, высокая - Y, длинная - Z
//  ZYX - широкая сторона параллельна оси Z, высокая - Y, длинная - X
type Rotation byte

const (
	XYZ Rotation = iota
	ZYX
	XZY
	YZX
	ZXY
	YXZ
)

const rotations = 6

// newRandom случайно генерирует новое значение поворота, отличное от исходного.
func (r Rotation) newRandom(random *rand.Rand) Rotation {
	var newRotation = Rotation(random.Intn(rotations))
	if newRotation == r {
		newRotation = (newRotation + 1) % rotations
	}
	return newRotation
}

// randomRotation генерирует случайное значение поворота.
func randomRotation(random *rand.Rand) Rotation {
	return Rotation(random.Intn(rotations))
}

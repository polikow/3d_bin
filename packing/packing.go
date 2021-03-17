package packing

import (
	"fmt"
	"math/rand"
)

// SearchAlgorithm - базовый интерфейс для всех алгоритмов поиска.
//
// Run выполняет одну итерацию алгоритма. Результатом этого метода является
// значение типа SearchResult.
//
// Done Возвращает значение false или true, в зависимости от того,
// работает ли еще алгоритм или нет.
type SearchAlgorithm interface {
	Run() SearchResult
	Done() bool
}

// SearchResult - результат работы одной итерации алгоритма, где:
//  Iteration - итерация, на которой был найден,
//  Value     - значение целевой функции,
//  Solution  - найденное решение (порядок упаковки),
//  Packed    - позиции упакованных грузов.
type SearchResult struct {
	Iteration int             `json:"iteration"`
	Value     float64         `json:"value"`
	Solution  Solution        `json:"solution"`
	Packed    []BlockPosition `json:"packed"`
}

func (s SearchResult) betterThan(another SearchResult) bool {
	return s.Value >= another.Value
}

// Evaluate выполняет алгоритм до тех пор, пока это возможно.
// Возвращает результат последней итерации алгоритма.
func Evaluate(algorithm SearchAlgorithm) SearchResult {
	var result SearchResult
	for {
		if algorithm.Done() {
			break
		} else {
			result = algorithm.Run()
		}
	}
	return result
}

// StepByStepBetter возвращает функцию с состоянием, которая возвращает только
// улучшенный результат работы алгоритма и значение false или true,
// в зависимости от того, возможен ли дальнейший поиск решений.
func StepByStepBetter(algorithm SearchAlgorithm) func() (SearchResult, bool) {
	var bestResult SearchResult

	return func() (SearchResult, bool) {
		var newResult SearchResult

		for {
			if algorithm.Done() {
				return bestResult, false
			} else {
				newResult = algorithm.Run()
				if newResult.betterThan(bestResult) {
					bestResult = newResult
					return bestResult, true
				} else {
					continue
				}
			}
		}
	}
}

func EvaluatePrintAll(algorithm SearchAlgorithm) SearchResult {
	var result SearchResult
	for {
		if algorithm.Done() {
			break
		} else {
			result = algorithm.Run()
			fmt.Printf("%4d) %.5g\n", result.Iteration, result.Value)
		}
	}
	return result
}

func EvaluatePrintBetter(algorithm SearchAlgorithm) SearchResult {
	var (
		bestResult SearchResult
		result     SearchResult
	)
	for {
		if algorithm.Done() {
			break
		} else {
			result = algorithm.Run()

			if bestResult.Value < result.Value {
				bestResult = result
				fmt.Printf("%4d) %.5g\n", result.Iteration, result.Value)
			}
		}
	}
	return bestResult
}

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

const rotationsAmount = 6

//newRandom случайно генерирует новое значение поворота, отличное от исходного.
func (r Rotation) newRandom() Rotation {
	var newRotation = Rotation(rand.Intn(rotationsAmount))
	if newRotation == r {
		newRotation = (newRotation + 1) % rotationsAmount
	}
	return newRotation
}

//randomRotation генерирует случайное значение поворота.
func randomRotation() Rotation {
	return Rotation(rand.Intn(rotationsAmount))
}

//Axis - одна из трех осей пространства.
type Axis byte

const (
	X = iota
	Y
	Z
)

type Shape3d interface {
	Volume() uint //Volume - объем трехмерного объекта.
}

//Block представляет собой ширину, высоту и длину груза
type Block struct {
	Width  uint `json:"w"`
	Height uint `json:"h"`
	Length uint `json:"l"`
}

func (b Block) Volume() uint {
	return b.Width * b.Height * b.Length
}

//findPosition вычисляет положение блока в пространстве с учетом:
//  point    - начальной точки расположения.
func (b Block) findPosition(point Point) BlockPosition {
	return BlockPosition{
		P1: point,
		P2: Point{
			X: point.X + b.Width,
			Y: point.Y + b.Height,
			Z: point.Z + b.Length,
		},
	}
}

func (b Block) rotatedBlock(rotation Rotation) Block {
	xShift, yShift, zShift := b.findShift(rotation)
	return Block{
		Width:  xShift,
		Height: yShift,
		Length: zShift,
	}
}

func (b Block) findShift(rotation Rotation) (xShift, yShift, zShift uint) {
	switch rotation {
	case XYZ:
		xShift = b.Width
		yShift = b.Height
		zShift = b.Length
	case ZYX:
		zShift = b.Width
		yShift = b.Height
		xShift = b.Length
	case XZY:
		xShift = b.Width
		zShift = b.Height
		yShift = b.Length
	case YZX: //shift down
		yShift = b.Length
		zShift = b.Width
		xShift = b.Height
	case ZXY: //shift up
		zShift = b.Height
		xShift = b.Length
		yShift = b.Width
	case YXZ:
		yShift = b.Width
		xShift = b.Height
		zShift = b.Length
	default:
		panic("wrong rotation value " + string(rotation))
	}
	return
}

func BlocksVolume(blocks []Block) uint {
	var blocksTotalVolume uint = 0
	for _, block := range blocks {
		blocksTotalVolume += block.Volume()
	}
	return blocksTotalVolume
}

//Point представляет собой точку в трехмерном пространстве.
//  Ось X направлена на восток.
//  Ось Y направлена вверх.
//  Ось Z направлена на юг.
type Point struct {
	X uint `json:"x"`
	Y uint `json:"y"`
	Z uint `json:"z"`
}

//BlockPosition положение груза в пространстве.
//  P1 - Координаты самого близкого угла к началу осей координат.
//  P2 - Координаты самого удаленного угла от начала осей координат.
type BlockPosition struct {
	P1 Point `json:"p1"`
	P2 Point `json:"p2"`
}

func (b BlockPosition) Volume() uint {
	return b.axisSize(X) * b.axisSize(Y) * b.axisSize(Z)
}

//overlappingX вычисляет, пересекаются ли блоки в пространстве по оси X.
func (b BlockPosition) overlappingX(b2 BlockPosition) bool {
	if b.P1.X == b2.P1.X {
		return true
	}
	if b.P1.X < b2.P1.X {
		return b.P2.X > b2.P1.X
	} else {
		return b2.P2.X > b.P1.X
	}
}

//overlappingY вычисляет, пересекаются ли блоки в пространстве по оси Y.
func (b BlockPosition) overlappingY(b2 BlockPosition) bool {
	if b.P1.Y == b2.P1.Y {
		return true
	}
	if b.P1.Y < b2.P1.Y {
		return b.P2.Y > b2.P1.Y
	} else {
		return b2.P2.Y > b.P1.Y
	}
}

//overlappingZ вычисляет, пересекаются ли блоки в пространстве по оси Z.
func (b BlockPosition) overlappingZ(b2 BlockPosition) bool {
	if b.P1.Z == b2.P1.Z {
		return true
	}
	if b.P1.Z < b2.P1.Z {
		return b.P2.Z > b2.P1.Z
	} else {
		return b2.P2.Z > b.P1.Z
	}
}

//overlapping вычисляет, пересекаются ли блоки в пространстве.
func (b BlockPosition) overlapping(b2 BlockPosition) bool {
	return b.overlappingX(b2) && b.overlappingY(b2) && b.overlappingZ(b2)
}

func areOverlapping(blocks ...BlockPosition) bool {
	for i := range blocks {
		for j := range blocks {
			if i != j {
				if blocks[i].overlapping(blocks[j]) {
					return true
				}
			}
		}
	}
	return false
}

//moveToNewAxisValue перемещает блок к новой позиции по заданной оси.
func (b *BlockPosition) moveToNewAxisValue(axis Axis, value uint) {
	var axisLength uint
	switch axis {
	case X:
		axisLength = b.P2.X - b.P1.X
		b.P1.X = value
		b.P2.X = value + axisLength
	case Y:
		axisLength = b.P2.Y - b.P1.Y
		b.P1.Y = value
		b.P2.Y = value + axisLength
	case Z:
		axisLength = b.P2.Z - b.P1.Z
		b.P1.Z = value
		b.P2.Z = value + axisLength
	}
}

func blockPositionsVolume(blockPositions []BlockPosition) uint {
	var volume uint = 0
	for _, blockPosition := range blockPositions {
		volume += blockPosition.Volume()
	}
	return volume
}

//axisSize размер блока относительно заданной оси.
func (b BlockPosition) axisSize(axis Axis) uint {
	switch axis {
	case X:
		return b.P2.X - b.P1.X
	case Y:
		return b.P2.Y - b.P1.Y
	case Z:
		return b.P2.Z - b.P1.Z
	default:
		panic("wrong axis specified " + string(axis))
	}
}

//Container представляет собой контейнер, в который необходимо разместить грузы
//определенного размера.
type Container struct {
	Width  uint `json:"w"`
	Height uint `json:"h"`
	Length uint `json:"l"`
}

func (c Container) Volume() uint {
	return c.Width * c.Height * c.Length
}

//doBlocksFitInsideContainer вычисляет, вмещаются ли блоки внутри контейнера.
func (c Container) doBlocksFitInside(blocks []Block) bool {
	if c.Volume() <= BlocksVolume(blocks) {
		return true
	} else {
		return false
	}
}

//canFitInside вычисляет, может ли данный груз размещен внутри контейнера
func (c Container) canFitInside(b Block) bool {
	if b.Length > c.Length || b.Height > c.Height || b.Width > c.Width {
		return false
	} else {
		return true
	}
}

//isBlockInside вычисляет, находится ли блок внутри контейнера.
//Если блок выходит за границы контейнера, то возващается false.
func (c Container) isBlockInside(b BlockPosition) bool {
	p1 := b.P1
	p2 := b.P2

	if p1.X > c.Width || p1.Y > c.Height || p1.Z > c.Length ||
		p2.X > c.Width || p2.Y > c.Height || p2.Z > c.Length {
		return false
	}
	return true
}

package packing

import "math/rand"

// Solution - порядок выполнения упаковки.
//  index    - индекс размещаемого груза
//  rotation - вариант поворота бл,ока
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

// Axis - одна из трех осей пространства.
//  Ось X направлена на восток.
//  Ось Y направлена вверх.
//  Ось Z направлена на юг.
type Axis byte

const (
	X = iota
	Y
	Z
)

type Shape3d interface {
	Volume() uint // Volume - объем трехмерного объекта.
}

// Block представляет собой ширину, высоту и длину груза
type Block struct {
	Width  uint `json:"w"`
	Height uint `json:"h"`
	Length uint `json:"l"`
}

// Volume вычисляет объем груза.
func (b Block) Volume() uint {
	return b.Width * b.Height * b.Length
}

// findPosition вычисляет положение груза в пространстве с учетом его
// начальной точки расположения.
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

func (b Block) findShift(rotation Rotation) (x, y, z uint) {
	switch rotation {
	case XYZ:
		x = b.Width
		y = b.Height
		z = b.Length
	case ZYX:
		z = b.Width
		y = b.Height
		x = b.Length
	case XZY:
		x = b.Width
		z = b.Height
		y = b.Length
	case YZX: //shift down
		y = b.Length
		z = b.Width
		x = b.Height
	case ZXY: //shift up
		z = b.Height
		x = b.Length
		y = b.Width
	case YXZ:
		y = b.Width
		x = b.Height
		z = b.Length
	default:
		panic("wrong rotation value " + string(rotation))
	}
	return
}

// blocksVolume вычисляет объем заданных грузов.
func blocksVolume(blocks []Block) uint {
	var blocksTotalVolume uint = 0
	for _, block := range blocks {
		blocksTotalVolume += block.Volume()
	}
	return blocksTotalVolume
}

// Point представляет собой точку в трехмерном пространстве.
type Point struct {
	X uint `json:"x"`
	Y uint `json:"y"`
	Z uint `json:"z"`
}

// BlockPosition положение груза в пространстве.
//  P1 - Координаты самого близкого угла к началу осей координат.
//  P2 - Координаты самого удаленного угла от начала осей координат.
type BlockPosition struct {
	P1 Point `json:"p1"`
	P2 Point `json:"p2"`
}

func (b BlockPosition) Volume() uint {
	return b.axisSize(X) * b.axisSize(Y) * b.axisSize(Z)
}

// overlappingX вычисляет, пересекаются ли грузы в пространстве по оси X.
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

// overlappingY вычисляет, пересекаются ли грузы в пространстве по оси Y.
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

// overlappingZ вычисляет, пересекаются ли грузы в пространстве по оси Z.
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

// overlapping вычисляет, пересекаются ли грузы в пространстве.
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

// moveToNewAxisValue перемещает груз к новой позиции по заданной оси.
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

// axisSize вычисляет размер груза относительно заданной оси.
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

// Container представляет собой контейнер, в который размещаются грузы.
type Container struct {
	Width  uint `json:"w"`
	Height uint `json:"h"`
	Length uint `json:"l"`
}

func (c Container) Volume() uint {
	return c.Width * c.Height * c.Length
}

// doBlocksFitInsideContainer вычисляет, вмещаются ли грузы внутри контейнера.
func (c Container) doBlocksFitInside(blocks []Block) bool {
	if c.Volume() <= blocksVolume(blocks) {
		return true
	} else {
		return false
	}
}

// canFitInside вычисляет, может ли данный груз размещен внутри контейнера
func (c Container) canFitInside(b Block) bool {
	if b.Length > c.Length || b.Height > c.Height || b.Width > c.Width {
		return false
	} else {
		return true
	}
}

// isBlockInside вычисляет, находится ли груз внутри контейнера.
// Если груз выходит за границы контейнера, то возващается false.
func (c Container) isBlockInside(b BlockPosition) bool {
	p1 := b.P1
	p2 := b.P2

	if p1.X > c.Width || p1.Y > c.Height || p1.Z > c.Length ||
		p2.X > c.Width || p2.Y > c.Height || p2.Z > c.Length {
		return false
	}
	return true
}

// GenerateRandomBlocks случайным образом создает грузы для контейнера.
func GenerateRandomBlocks(random *rand.Rand, container Container) []Block {
	const (
		hugeBlockProbability = 0.05
		bigBlockProbability  = 0.15

		hugeMin, hugeMax   = 0.3, 0.8
		bigMin, bigMax     = 0.25, 0.4
		smallMin, smallMax = 0.05, 0.18
	)
	var (
		blocks []Block
		block  Block
	)

	for blocksVolume(blocks) <= ceilMultiplicationUINT(container.Volume(), 1.2) {
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

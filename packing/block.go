package packing

// Block представляет собой ширину, высоту и длину груза
type Block struct {
	Width  uint `json:"w"`
	Height uint `json:"h"`
	Length uint `json:"l"`
}

func (b Block) isSane() bool {
	return b.Width > 0 && b.Height > 0 && b.Length > 0
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

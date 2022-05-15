package packing

// BlockPosition положение груза в пространстве.
//  P1 - Координаты самого близкого угла к началу осей координат.
//  P2 - Координаты самого удаленного угла от начала осей координат.
type BlockPosition struct {
	P1 Point `json:"p1"`
	P2 Point `json:"p2"`
}

// Volume вычисляет объем этого груза.
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
	default:
		panic(ErrInvalidAxis)
	}
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
		panic(ErrInvalidAxis)
	}
}

// areOverlapping проверяет, пересекаются ли эти грузы.
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

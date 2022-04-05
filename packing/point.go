package packing

// Point представляет собой точку в трехмерном пространстве.
type Point struct {
	X uint `json:"x"`
	Y uint `json:"y"`
	Z uint `json:"z"`
}

func (p Point) isInside(b Block) bool {
	return p.X <= b.Width && p.Y <= b.Height && p.Z <= b.Length
}

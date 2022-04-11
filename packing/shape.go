package packing

type Shape3d interface {
	Volume() uint // Volume - объем трехмерного объекта.
}

// VolumeOf вычисляет объем объектов.
func VolumeOf[T Shape3d](shapes ...T) uint {
	var result uint = 0
	for _, shape := range shapes {
		result += shape.Volume()
	}
	return result
}

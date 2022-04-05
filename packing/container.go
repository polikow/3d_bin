package packing

// Container представляет собой контейнер, в который размещаются грузы.
type Container Block

func (c Container) Volume() uint {
	return Block(c).Volume()
}

// doBlocksFitInsideContainer вычисляет, вмещаются ли грузы внутри контейнера.
func (c Container) doBlocksFitInside(blocks []Block) bool {
	return VolumeOf(c) <= VolumeOf(blocks...)
}

// canFitInside вычисляет, может ли данный груз размещен внутри контейнера
func (c Container) canFitInside(b Block) bool {
	return b.Length <= c.Length && b.Height <= c.Height && b.Width <= c.Width
}

// isBlockInside вычисляет, находится ли груз внутри контейнера.
// Если груз выходит за границы контейнера, то возващается false.
func (c Container) isBlockInside(b BlockPosition) bool {
	return b.P1.isInside(Block(c)) && b.P2.isInside(Block(c))
}

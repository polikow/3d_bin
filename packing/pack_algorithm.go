package packing

// PackAlgorithm - алгоритм упаковки.
type PackAlgorithm struct {

	container Container // контейнер, в который упаковываются блоки
	blocks    []Block   // блоки, которые необходимо упаковать
	solution  Solution  // порядок упаковки

	step   int             // текущий шаг алгоритма
	packed []BlockPosition // положения уже упакованных блоков

	// используется при поиске свободных мест для каждой оси
	borders []uint // границы мест
	isFree  []bool // флаг свободности для каждого места

	shiftZ, shiftY, shiftX uint // смещение начальной точки по осям
	layer                  uint // текущий слой заполнения(нижняя граница по Y)
	layerFirstIndex        int  // индекс первого упакованного на этом уровне
}

func NewPackAlgorithm(container Container, blocks []Block) *PackAlgorithm {
	n := len(blocks)
	if n == 0 {
		panic("No blocks specified")
	}

	return &PackAlgorithm{
		container:       container,
		blocks:          blocks,
		solution:        nil,
		step:            0,
		packed:          make([]BlockPosition, 0, n),
		borders:         make([]uint, 0, 2*n+2),
		isFree:          make([]bool, 0, 2*n+1),
		shiftZ:          0,
		shiftY:          0,
		shiftX:          0,
		layer:           0,
		layerFirstIndex: 0,
	}
}

// Run полностью выполняет упаковку до тех пор, пока это возможно.
// Возвращает массив упакованных блоков.
// (нужно скопировать результат, если он используется далее)
func (a *PackAlgorithm) Run(solution Solution) []BlockPosition {
	a.reset(solution)

	var isBlockPacked = true
	for isBlockPacked && a.isThereBlockToPack() {
		isBlockPacked = a.packNextBlock()
	}
	return a.packed
}

func (a PackAlgorithm) isThereBlockToPack() bool {
	return a.step < len(a.blocks)
}

func (a *PackAlgorithm) reset(solution Solution) {
	a.checkSolution(solution)
	a.packed = a.packed[:0]
	a.step = 0
	a.solution = solution

	a.shiftZ = 0
	a.shiftY = 0
	a.shiftX = 0
	a.layer = 0
	a.layerFirstIndex = 0
}

// checkSolution проверяет решение.
func (a PackAlgorithm) checkSolution(solution Solution) {
	if len(solution) != len(a.blocks) {
		panic("Wrong packed specified")
	}
	for _, indexRotation := range solution {
		if indexRotation.Rotation < XYZ || indexRotation.Rotation > YXZ {
			panic("Wrong rotation specified: " + string(indexRotation.Rotation))
		}
	}
	uniqueValues := make(map[int]bool, len(solution))
	for _, indexRotation := range solution {
		uniqueValues[indexRotation.Index] = true
	}
	if len(uniqueValues) < len(solution) {
		panic("Wrong packed specified")
	}
}

// packNextBlock выполняет упаковку следующего блока. Если его упаковать нельзя,
// то функция возвращает false, иначе true.
func (a *PackAlgorithm) packNextBlock() (isPackable bool) {
	if a.step >= len(a.blocks) {
		return false
	}

	indexRotation := a.solution[a.step]    //номер блока
	block := a.blocks[indexRotation.Index] //пакуемый блок
	rotation := indexRotation.Rotation     //его поворот
	rotatedBlock := block.rotatedBlock(rotation)

	//1 этап - поиск начальной точки
	startingPoint := a.findStartingPoint(rotatedBlock)
	blockPosition := rotatedBlock.findPosition(startingPoint)

	//2 этап - уплотнение
	isPackable = a.moveDownOnAxis(Y, &blockPosition)
	if !isPackable {
		return false
	}
	isPackable = a.moveDownOnAxis(Z, &blockPosition)
	if !isPackable {
		return false
	}
	isPackable = a.moveDownOnAxis(X, &blockPosition)
	if !isPackable {
		return false
	}

	a.addToPacked(blockPosition)

	return true
}

// addToPacked - сохранение блока как успешно упакованного.
func (a *PackAlgorithm) addToPacked(position BlockPosition) {
	a.packed = append(a.packed, position)
	a.step++
}

// moveDownOnAxis выполняет спуск вдоль заданной оси.
func (a *PackAlgorithm) moveDownOnAxis(axis Axis, position *BlockPosition) bool {
	a.findEmptyAreasOnAxis(axis, position)
	size := position.axisSize(axis)
	value, isPackable := a.selectFirstFittingArea(size)
	if isPackable {
		position.moveToNewAxisValue(axis, value)
	}
	return isPackable
}

// findEmptyAreasOnAxis находит свободные по оси axis места для блока.
func (a *PackAlgorithm) findEmptyAreasOnAxis(axis Axis, position *BlockPosition) {
	a.prepareBordersAndAreas(axis)

	// Поиск пересекающихся в плоскости блоков.
	// Построение списка доступных мест по заданной оси.
	for _, packed := range a.packed {
		var newLower uint
		var newHigher uint
		switch axis {
		case X:
			if position.overlappingY(packed) && position.overlappingZ(packed) {
				newLower = packed.P1.X
				newHigher = packed.P2.X
			}
		case Y:
			if position.overlappingX(packed) && position.overlappingZ(packed) {
				newLower = packed.P1.Y
				newHigher = packed.P2.Y
			}
		case Z:
			if position.overlappingX(packed) && position.overlappingY(packed) {
				newLower = packed.P1.Z
				newHigher = packed.P2.Z
			}
		default:
			panic("wrong axis specified " + string(axis))
		}

		if newLower == newHigher {
			continue
		}
		a.addOverlappingArea(newLower, newHigher)
	}
}

// prepareBordersAndAreas очищает от результатов предыдущего поиска.
func (a *PackAlgorithm) prepareBordersAndAreas(searchAxis Axis) {
	a.borders = a.borders[:0]
	a.isFree = a.isFree[:0]

	// изначально всего есть 1 свободная область, которая ограничена
	// 2 точками - начало и конец контейнера
	a.borders = append(a.borders, 0)
	switch searchAxis {
	case X:
		a.borders = append(a.borders, a.container.Width)
	case Y:
		a.borders = append(a.borders, a.container.Height)
	case Z:
		a.borders = append(a.borders, a.container.Length)
	default:
		panic("wrong case")
	}

	a.isFree = append(a.isFree, true)
}

// addOverlappingArea добавляет место в массив использованных мест.
//  newLower  - нижняя граница нового места,
//  newHigher - верхняя граница нового места.
func (a *PackAlgorithm) addOverlappingArea(newLower uint, newHigher uint) {
	var (
		i      = 0
		lower  uint // нижняя граница места
		higher uint // верхняя граница
	)
ApplyOverlappingArea:
	for {
		lower = a.borders[i]
		higher = a.borders[i+1]

		if lower > higher {
			panic("lower > higher") //todo remove later
		}

		if lower == higher {
			panic("lower == higher'") //todo remove later
		}

		switch {

		case newLower == lower && newHigher == higher:
			a.isFree[i] = false
			break ApplyOverlappingArea

		case newLower == lower && newHigher < higher:
			isSubAreaFree := a.isFree[i]
			a.isFree[i] = false
			insertBOOL(&a.isFree, i+1, isSubAreaFree)
			insertUINT(&a.borders, i+1, newHigher)
			break ApplyOverlappingArea

		case newLower == lower && newHigher > higher:
			a.isFree[i] = false
			newLower = higher
			i++

		case newLower > lower && newHigher == higher:
			insertBOOL(&a.isFree, i+1, false)
			insertUINT(&a.borders, i+1, newLower)
			break ApplyOverlappingArea

		case newLower > lower && newHigher < higher:
			isSubAreaFree := a.isFree[i]
			insertBOOL(&a.isFree, i+1, false)
			insertBOOL(&a.isFree, i+2, isSubAreaFree)
			insertUINT(&a.borders, i+1, newLower)
			insertUINT(&a.borders, i+2, newHigher)
			break ApplyOverlappingArea

			//todo still might be some errors
		case newLower > lower && newLower < higher && newHigher > higher:
			insertBOOL(&a.isFree, i+1, false)
			insertUINT(&a.borders, i+1, newLower)
			newLower = higher
			i++

		case newLower > lower && newLower > higher:
			i++
			continue ApplyOverlappingArea

		case newLower > lower:
			i++
			continue ApplyOverlappingArea

		default:
			panic("wrong case")
		}
	}
}

// findStartingPoint находит точку, с которой начинается упаковка груза.
// В этой точке невозможно пересечение с уже размещенными блоками.
func (a *PackAlgorithm) findStartingPoint(block Block) Point {
	if len(a.packed) == 0 {
		return Point{
			a.shiftX,
			a.shiftY,
			a.shiftZ,
		}
	}

	position := a.packed[len(a.packed)-1] // последний упакованный блок

	// изменение смещения начальной точки для этого блока
	if a.shiftX < position.P2.X {
		a.shiftX = position.P2.X
	}

	if a.shiftZ < position.P2.Z {
		a.shiftZ = position.P2.Z
	}

	if a.shiftY < position.P2.Y {
		a.shiftY = position.P2.Y
	}

	widthLeft := a.container.Width - a.shiftX
	notEnoughWidth := widthLeft < block.Width

	lengthLeft := a.container.Length - a.shiftZ
	notEnoughLength := lengthLeft < block.Length

	if notEnoughWidth && notEnoughLength {
		a.shiftX = 0
		a.shiftZ = 0
		a.layer = a.shiftY
		a.layerFirstIndex = a.step

		return Point{
			a.shiftX,
			a.shiftY,
			a.shiftZ,
		}
	}

	if notEnoughWidth {
		var newShiftX uint = 0
		for i := a.layerFirstIndex; i < len(a.packed); i++ {
			position := a.packed[i]

			isInCurrentLayer := position.P1.Y >= a.layer
			setsShiftZ := position.P2.Z == a.shiftZ
			if isInCurrentLayer && setsShiftZ {
				if newShiftX <= position.P1.X {
					newShiftX = position.P1.X
					break
				}
			}
		}
		a.shiftX = newShiftX
	}

	if notEnoughLength {
		var newShiftZ uint = 0
		for i := a.layerFirstIndex; i < len(a.packed); i++ {
			position := a.packed[i]

			isInCurrentLayer := position.P1.Y >= a.layer
			setsShiftX := position.P2.X == a.shiftX

			if isInCurrentLayer && setsShiftX {
				if newShiftZ <= position.P1.Z {
					newShiftZ = position.P1.Z
				}
			}
		}
		a.shiftZ = newShiftZ
	}

	//все еще недостаточно места по длине и/или по ширине, то начать новый слой
	widthLeft = a.container.Width - a.shiftX
	notEnoughWidth = widthLeft < block.Width

	lengthLeft = a.container.Length - a.shiftZ
	notEnoughLength = lengthLeft < block.Length

	if notEnoughWidth || notEnoughLength {
		a.shiftX = 0
		a.shiftZ = 0
		a.layer = a.shiftY
		a.layerFirstIndex = a.step
	}

	return Point{
		a.shiftX,
		a.shiftY,
		a.shiftZ,
	}
}

// selectFirstFittingArea среди найденных мест находит точку в которой возможно
// разместить блок.
func (a *PackAlgorithm) selectFirstFittingArea(size uint) (uint, bool) {
	for i := 0; i < len(a.borders)-1; i++ {
		if !a.isFree[i] {
			continue
		}

		var (
			lower    = a.borders[i]
			higher   = a.borders[i+1]
			areaSize = higher - lower
		)
		if areaSize >= size {
			return lower, true
		}
	}
	return 0, false //не нашлось подходящего места
}

// insertUINT выполняет вставку элемента на место index.
// Все элементы, начиная с index до последнего смещаются вправо.
func insertUINT(s *[]uint, index int, value uint) {
	if len(*s) == cap(*s) {
		panic("not enough capacity")
	}

	*s = append(*s, 0)
	copy((*s)[index+1:], (*s)[index:])
	(*s)[index] = value
}

// insertBOOL выполняет вставку элемента на место index.
// Все элементы, начиная с index до последнего смещаются вправо.
func insertBOOL(s *[]bool, index int, value bool) {
	if len(*s) == cap(*s) {
		panic("not enough capacity")
	}

	*s = append(*s, false)
	copy((*s)[index+1:], (*s)[index:])
	(*s)[index] = value
}

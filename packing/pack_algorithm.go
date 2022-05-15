package packing

import (
	"errors"
	"fmt"
)

var ErrPackAlgorithmUnrecoverable = errors.New("unrecoverable pack algorithm failure")

// PackAlgorithm - алгоритм упаковки.
type PackAlgorithm struct {
	container Container // контейнер, в который упаковываются грузы
	blocks    []Block   // грузы, которые необходимо упаковать
	solution  Solution  // порядок упаковки

	step   int             // текущий шаг алгоритма
	packed []BlockPosition // положения уже упакованных грузов

	// используется при поиске свободных мест для каждой оси
	borders []uint // границы мест
	isFree  []bool // флаг свободности для каждого места

	shiftZ, shiftY, shiftX uint // смещение начальной точки по осям
}

func NewPackAlgorithm(task Task) *PackAlgorithm {
	if _, err := task.isSane(); err != nil {
		panic(err)
	}
	n := len(task.Blocks)
	return &PackAlgorithm{
		container: task.Container,
		blocks:    task.Blocks,
		solution:  nil,
		step:      0,
		packed:    make([]BlockPosition, 0, n),
		borders:   make([]uint, 0, 2*n+2),
		isFree:    make([]bool, 0, 2*n+1),
		shiftZ:    0,
		shiftY:    0,
		shiftX:    0,
	}
}

// Run полностью выполняет упаковку до тех пор, пока это возможно.
// Возвращает массив упакованных грузов.
// (нужно скопировать результат, если он используется далее)
func (a *PackAlgorithm) Run(solution Solution) []BlockPosition {
	a.reset(solution)

	var isBlockPacked = true
	for isBlockPacked && a.isThereBlockToPack() {
		isBlockPacked = a.packNextBlock()
	}
	return a.packed
}

// isThereBlockToPack проверяет, остались ли еще неупакованные грузы.
func (a *PackAlgorithm) isThereBlockToPack() bool {
	return a.step < len(a.blocks)
}

// reset возвращает алгоритм в исходное состояние.
// Используется для повторного использования алгоритма
func (a *PackAlgorithm) reset(solution Solution) {
	a.checkSolution(solution)
	a.packed = a.packed[:0]
	a.step = 0
	a.solution = solution

	a.shiftZ = 0
	a.shiftY = 0
	a.shiftX = 0
}

// checkSolution проверяет решение.
func (a *PackAlgorithm) checkSolution(solution Solution) {
	if _, err := solution.isSane(Task{a.container, a.blocks}); err != nil {
		panic(fmt.Errorf("%w: %v", ErrPackAlgorithmUnrecoverable, err.Error()))
	}
}

// packNextBlock выполняет упаковку следующего груза.
// Если его упаковать нельзя, то функция возвращает false, иначе true.
func (a *PackAlgorithm) packNextBlock() (isPackable bool) {
	if a.step >= len(a.blocks) {
		return false
	}

	indexRotation := a.solution[a.step]          // номер груза
	block := a.blocks[indexRotation.Index]       // пакуемый груз
	rotation := indexRotation.Rotation           // его поворот
	rotatedBlock := block.rotatedBlock(rotation) // его повернутая версия

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
	isPackable = a.moveDownOnAxis(Y, &blockPosition)
	if !isPackable {
		return false
	}

	a.addToPacked(blockPosition)

	return true
}

// addToPacked сохраняет груз как успешно упакованный.
func (a *PackAlgorithm) addToPacked(position BlockPosition) {
	a.packed = append(a.packed, position)
	a.step++
}

// moveDownOnAxis выполняет спуск груза вдоль заданной оси.
func (a *PackAlgorithm) moveDownOnAxis(axis Axis, position *BlockPosition) bool {
	a.findEmptyAreasOnAxis(axis, position)
	size := position.axisSize(axis)
	value, isPackable := a.selectFirstFittingArea(size)
	if isPackable {
		position.moveToNewAxisValue(axis, value)
	}
	return isPackable
}

// findEmptyAreasOnAxis находит свободные по оси axis места для груза.
func (a *PackAlgorithm) findEmptyAreasOnAxis(axis Axis, position *BlockPosition) {
	a.prepareBordersAndAreas(axis)

	// Поиск пересекающихся в плоскости грузов.
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
			panic(ErrInvalidAxis)
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
	// 2мя точками - начало и конец контейнера
	a.borders = append(a.borders, 0)
	switch searchAxis {
	case X:
		a.borders = append(a.borders, a.container.Width)
	case Y:
		a.borders = append(a.borders, a.container.Height)
	case Z:
		a.borders = append(a.borders, a.container.Length)
	default:
		panic(ErrInvalidAxis)
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
			panic(fmt.Errorf("%w: lower > higher", ErrPackAlgorithmUnrecoverable))
		}

		if lower == higher {
			panic(fmt.Errorf("%w: lower == higher", ErrPackAlgorithmUnrecoverable))
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
			panic(fmt.Errorf("%w: wrong case", ErrPackAlgorithmUnrecoverable))
		}
	}
}

// findStartingPoint находит точку, с которой начинается упаковка груза.
// В этой точке невозможно пересечение с уже размещенными грузами.
func (a *PackAlgorithm) findStartingPoint(block Block) Point {
	if len(a.packed) == 0 {
		return Point{
			a.shiftX,
			a.shiftY,
			a.shiftZ,
		}
	}

	lastPosition := a.packed[len(a.packed)-1] // последний упакованный груз

	// изменение смещения начальной точки для этого груза
	if a.shiftX < lastPosition.P2.X {
		a.shiftX = lastPosition.P2.X
	}

	if a.shiftZ < lastPosition.P2.Z {
		a.shiftZ = lastPosition.P2.Z
	}

	if a.shiftY < lastPosition.P2.Y {
		a.shiftY = lastPosition.P2.Y
	}

	widthLeft := a.container.Width - a.shiftX
	notEnoughWidth := widthLeft < block.Width

	lengthLeft := a.container.Length - a.shiftZ
	notEnoughLength := lengthLeft < block.Length

	// Если недостаточно места одновременно по ширине и длине, то сместить
	// в начало по осям X и Z.
	if notEnoughWidth && notEnoughLength {
		a.shiftX = 0
		a.shiftZ = 0

		return Point{
			a.shiftX,
			a.shiftY,
			a.shiftZ,
		}
	}

	// Если недостаточно места по ширине, то сместить по X настолько,
	// насколько это позволяют уже расположенные грузы.
	//
	// Для этого проверяются все грузы, которые находятся на уровне
	// shiftY - block.Height, и которые задают сдвиг по оси Z на этом уровне.
	if notEnoughWidth {
		var newShiftX uint = 0
		var blockP2 = a.shiftY
		for _, position := range a.packed {

			onSameLevel := false
			if blockP2 > position.P2.Y {
				if blockP2-position.P2.Y < block.Height {
					onSameLevel = true
				}
			} else {
				if position.P2.Y-blockP2 < block.Height {
					onSameLevel = true
				}
			}

			if onSameLevel {
				setsShiftZ := position.P2.Z == a.shiftZ
				if setsShiftZ {
					if newShiftX <= position.P1.X {
						newShiftX = position.P1.X
						break
					}
				}
			}
		}
		a.shiftX = newShiftX
	}

	// Если недостаточно места по длине, то сместить по Z настолько,
	// насколько это позволяют уже расположенные грузы.
	//
	// Для этого проверяются все грузы, которые находятся на уровне
	// shiftY - block.Height, и которые задают сдвиг по оси X на этом уровне.
	if notEnoughLength {
		var newShiftZ uint = 0
		var blockP2 = a.shiftY
		for _, position := range a.packed {

			onSameLevel := false
			if blockP2 > position.P2.Y {
				if blockP2-position.P2.Y < block.Height {
					onSameLevel = true
				}
			} else {
				if position.P2.Y-blockP2 < block.Height {
					onSameLevel = true
				}
			}

			if onSameLevel {
				setsShiftX := position.P2.X == a.shiftX
				if setsShiftX {
					if newShiftZ <= position.P1.Z {
						newShiftZ = position.P1.Z
					}
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
	}

	return Point{
		a.shiftX,
		a.shiftY,
		a.shiftZ,
	}
}

// selectFirstFittingArea среди найденных мест находит точку в которой возможно
// разместить груз.
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
		panic(fmt.Errorf("%w: not enough capacity", ErrPackAlgorithmUnrecoverable))
	}

	*s = append(*s, 0)
	copy((*s)[index+1:], (*s)[index:])
	(*s)[index] = value
}

// insertBOOL выполняет вставку элемента на место index.
// Все элементы, начиная с index до последнего смещаются вправо.
func insertBOOL(s *[]bool, index int, value bool) {
	if len(*s) == cap(*s) {
		panic(fmt.Errorf("%w: not enough capacity", ErrPackAlgorithmUnrecoverable))
	}

	*s = append(*s, false)
	copy((*s)[index+1:], (*s)[index:])
	(*s)[index] = value
}

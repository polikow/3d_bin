package packing

// searchState - состояние алгоритма поиска.
type searchState struct {
	Task

	n               int            // размер задачи
	containerVolume float64        // объем контейнера
	packAlgorithm   *PackAlgorithm // алгоритм упаковки

	currentValue            float64         // лучшее цф на данной итерации
	bestValueFound          float64         // лучшее найденное значение цф
	bestSolutionFound       Solution        // лучшее найденное решение
	bestPackedFound         []BlockPosition // лучшая упаковка грузов
	iterationsPassed        int             // итераций выполнено
	iterationsNoImprovement int             // итераций выполнено без улучшений
}

func newSearchState(task Task) searchState {
	return searchState{
		Task: task,

		n:               task.Size(),
		containerVolume: float64(VolumeOf(task.Container)),
		packAlgorithm:   NewPackAlgorithm(task.Container, task.Blocks),

		bestValueFound:          0,
		bestSolutionFound:       make(Solution, task.Size()),
		bestPackedFound:         make([]BlockPosition, task.Size()),
		iterationsPassed:        0,
		iterationsNoImprovement: 0,
	}
}

// findFill выполняет поиск заполненности контейнера для этого решения.
func (s searchState) findFill(solution Solution) float64 {
	packed := s.packAlgorithm.Run(solution)
	packedVolume := VolumeOf(packed...)
	return float64(packedVolume) / s.containerVolume
}

// update обновляет состояние поиска.
func (s *searchState) update(solution Solution, value float64) {
	if s.bestValueFound < value {
		s.bestValueFound = value

		copy(s.bestSolutionFound, solution)

		packed := s.packAlgorithm.Run(s.bestSolutionFound)
		s.bestPackedFound = append(s.bestPackedFound[:0], packed...)

		s.iterationsNoImprovement = 0
	} else {
		s.iterationsNoImprovement++
	}

	s.iterationsPassed++
}

// result возвращает результат поиска.
func (s searchState) result() SearchResult {
	copyBestSolutionFound := make(Solution, len(s.bestSolutionFound))
	copy(copyBestSolutionFound, s.bestSolutionFound)

	copyNestPackedFound := make([]BlockPosition, len(s.bestPackedFound))
	copy(copyNestPackedFound, s.bestPackedFound)

	return SearchResult{
		Iteration: s.iterationsPassed,
		Value:     s.bestValueFound,
		Solution:  copyBestSolutionFound,
		Packed:    copyNestPackedFound,
	}
}

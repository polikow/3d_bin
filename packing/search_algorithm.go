package packing

import "fmt"

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
//  Value     - лучшее значение цф за все итерации,
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

// searchState - состояние алгоритма поиска.
type searchState struct {
	container Container // контейнер
	blocks    []Block   // загружаемые в контейнер грузы

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

func newSearchState(container Container, blocks []Block) searchState {
	n := len(blocks)

	return searchState{
		container: container,
		blocks:    blocks,

		n:               n,
		containerVolume: float64(container.Volume()),
		packAlgorithm:   NewPackAlgorithm(container, blocks),

		bestValueFound:          0,
		bestSolutionFound:       make(Solution, n),
		bestPackedFound:         make([]BlockPosition, n),
		iterationsPassed:        0,
		iterationsNoImprovement: 0,
	}
}

// findFill - поиск заполненности контейнера.
func (s searchState) findFill(solution Solution) float64 {
	packed := s.packAlgorithm.Run(solution)
	packedVolume := blockPositionsVolume(packed)
	return float64(packedVolume) / s.containerVolume
}

// update обновление состояния поиска.
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

func (s searchState) result() SearchResult {
	return SearchResult{
		Iteration: s.iterationsPassed,
		Value:     s.bestValueFound,
		Solution:  s.bestSolutionFound,
		Packed:    s.bestPackedFound,
	}
}

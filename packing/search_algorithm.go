package packing

import (
	"fmt"
	"time"
)

// SearchAlgorithm - базовый интерфейс для всех алгоритмов поиска.
type SearchAlgorithm interface {
	// Run выполняет одну итерацию алгоритма. Результатом этого метода является
	// значение типа SearchResult.
	Run() SearchResult

	// Done Возвращает значение false или true, в зависимости от того,
	// работает ли еще алгоритм или нет.
	Done() bool
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

// EvaluateTimed полностью выполняет заданный алгоритм. Возвращает конечный
// результат этого алгоритма поиска и время, которое выполнялся этот алгоритм.
// (время в миллисекундах)
func EvaluateTimed(algorithm SearchAlgorithm) (SearchResult, int64) {
	start := time.Now()
	result := Evaluate(algorithm)
	milliseconds := time.Now().Sub(start).Milliseconds()
	return result, milliseconds
}

// EvaluateTimedLimited выполняет заданный алгоритм n раз.
// Если алгоритм не может быть выполнен n раз, то вызывается panic.
//
// Возвращает конечный результат этого алгоритма поиска и время, которое
// выполнялся этот алгоритм. (время в миллисекундах)
func EvaluateTimedLimited(algorithm SearchAlgorithm, n int) (SearchResult, int64) {
	start := time.Now()

	var result SearchResult
	for i := 0; i < n; i++ {
		result = algorithm.Run()
		if result.Value == 1 {
			break
		}
	}

	milliseconds := time.Now().Sub(start).Milliseconds()
	return result, milliseconds
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
				if newResult.BetterThan(bestResult) {
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

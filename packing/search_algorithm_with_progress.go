package packing

import "sync"

// SearchAlgorithmWithProgress - алгоритм поиска, для которого в любой момент
// времени известен его прогресс.
type SearchAlgorithmWithProgress interface {
	SearchAlgorithm
	Progresser
}

// MultipleSearchResult - результат работы нескольких алгоритмов над задачей.
type MultipleSearchResult struct {
	SearchResult
	Statuses []Progress `json:"statuses"` // состояния работы каждого алгоритма
}

// EvaluateMultiple конкурентно вычисляет каждый экземпляр алгоритма.
// Общий результат работы с текущим прогрессом каждого экземпляра посылается в канал.
func EvaluateMultiple(algorithms []SearchAlgorithmWithProgress) <-chan MultipleSearchResult {
	results := make(chan instanceResult, 10)
	wg := &sync.WaitGroup{}

	wg.Add(len(algorithms))
	for id, algorithm := range algorithms {
		go evaluateInstance(wg, id, results, algorithm)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	resultsWithStatuses := make(chan MultipleSearchResult, 10)
	go func() {
		// состояние выполнения каждого экземпляра алгоритма
		statuses := make([]Progress, 0, len(algorithms))
		for _, algorithm := range algorithms {
			statuses = append(statuses, algorithm.Progress())
		}

		bestResult := SearchResult{}

		for result := range results {
			if result.BetterThan(bestResult) {
				bestResult = result.SearchResult
			}

			statuses[result.id] = result.Progress

			statusesCopy := make([]Progress, len(statuses))
			copy(statusesCopy, statuses)

			resultsWithStatuses <- MultipleSearchResult{
				SearchResult: bestResult,
				Statuses:     statusesCopy,
			}
		}
		close(resultsWithStatuses)
	}()
	return resultsWithStatuses
}

// instanceResult - результат работы одного экземпляра алгоритма.
type instanceResult struct {
	id int // номер экземпляра алгоритма
	Progress
	SearchResult
}

// evaluateInstance вычисляет экземпляр алгоритма.
// Результат очередной итерации отправляется в канал.
func evaluateInstance(wg *sync.WaitGroup, id int, ch chan<- instanceResult, algorithm SearchAlgorithmWithProgress) {
	iterationsWithoutImprovement := 0
	lastValue := float64(-1)

	for !algorithm.Done() {
		searchResult := algorithm.Run()

		if lastValue == searchResult.Value {
			iterationsWithoutImprovement++
		} else {
			iterationsWithoutImprovement = 0
			lastValue = searchResult.Value
		}

		ch <- instanceResult{
			id:           id,
			Progress:     algorithm.Progress(),
			SearchResult: searchResult,
		}
	}
	wg.Done()
}

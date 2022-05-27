package main

import (
	"encoding/json"
	"fmt"
	"github.com/polikow/3d_bin/packing"
	"io/ioutil"
	"runtime"
	"sort"
	"sync"
	"time"
)

const (
	n          = 150 // количество запусков для одних и тех же параметров
	taskPath   = "/home/aleksey/3d_bin/saved/47blocks.json"
	resultPath = "/home/aleksey/3d_bin/research/ga/47blocks_2try"

	npStart, npStop, npStep = 150, 150, 150
	niStart, niStop, niStep = 50, 400, 50
	mpStart, mpStop, mpStep = 0.01, 0.50, 0.01

	// всего запусков
	total = n * ((mpStop-mpStart)/mpStep + 1) * ((niStop-niStart)/niStep + 1)
)

type input struct {
	packing.Task
	packing.GASettings

	index int
}

type result struct {
	packing.GASettings
	packing.SearchResult

	index int
	Time  int64   `json:"time"` // время вычисления в миллисекундах
	Value float64 `json:"value"`
}

func (r result) String() string {
	seconds := float64(r.Time) / 1000
	return fmt.Sprintf(
		"%6.4g, %6.2g sec. (np=%2d, ni=%3d, mp=%5.3g) [%v]",
		r.Value, seconds, r.Np, r.Ni, r.Mp, r.Evolution)
}

type resultArr []result

func (r resultArr) Len() int { return len(r) }

func (r resultArr) Less(i, j int) bool { return r[i].index < r[j].index }

func (r resultArr) Swap(i, j int) { r[i], r[j] = r[j], r[i] }

func sortResults(results []result) {
	sort.Sort(resultArr(results))
}

func worker(jobs <-chan input, results chan<- result, wg *sync.WaitGroup) {
	defer wg.Done()

	for job := range jobs {
		ga := packing.NewGA(job.Task, job.GASettings)
		searchResult, milliseconds := packing.EvaluateTimed(ga)

		results <- result{
			GASettings:   job.GASettings,
			SearchResult: searchResult,

			index: job.index,
			Time:  milliseconds,
			Value: searchResult.Value,
		}
	}
}

func jobProvider(wg *sync.WaitGroup) <-chan input {
	var (
		// исследуемые параметры
		np int
		ni int
		mp float64

		evolution = new(packing.DarwinEvolution)

		jobs = make(chan input, 100)
	)

	task, err := packing.LoadTaskFromJSONFile(taskPath)
	if err != nil {
		panic(err)
	}

	go func() {
		defer close(jobs)
		defer wg.Done()

		index := 0
		for np = npStart; np <= npStop; np += npStep {
			for ni = niStart; ni <= niStop; ni += niStep {
				for mp = mpStart; mp <= mpStop; mp += mpStep {
					for i := 0; i < n; i++ {
						jobs <- input{
							Task: task,
							GASettings: packing.GASettings{
								Np:        np,
								Mp:        mp,
								Ni:        ni,
								Evolution: evolution,
								Random:    nil,
							},

							index: index,
						}
						index++
					}
				}
			}
		}
	}()

	return jobs
}

func saveIntoJSON(path string, dataToSave interface{}) {
	data, err := json.Marshal(dataToSave)
	if err != nil {
		panic(err)
	} else {
		err = ioutil.WriteFile(path, data, 0644)
		if err != nil {
			panic(err)
		}
	}
}

func main() {
	var (
		resultsCh = make(chan result, 100)
		wg        = new(sync.WaitGroup)
		results   = make([]result, 0, total)
		timeStart = time.Now()
		cpus      = runtime.NumCPU()
	)
	runtime.GOMAXPROCS(cpus)

	// запуск провайдера и воркеров
	wg.Add(cpus + 1)
	jobs := jobProvider(wg)
	for i := 0; i < cpus; i++ {
		go worker(jobs, resultsCh, wg)
	}

	// дожидается пока провайдер и все воркеры не закончат свою работу,
	// после чего закрывает канал результатов, чтобы основной поток
	// продолжил исполнение
	go func() {
		wg.Wait()
		close(resultsCh)
	}()

	// сбор результатов от воркеров
	for r := range resultsCh {
		fmt.Printf("%5d) %s\n", len(results)+1, r)
		results = append(results, r)
	}

	// сортировка результатов
	// (воркеры выполняли задачи с разной скоростью, поэтому порядок нарушен)
	sortResults(results)

	var (
		average = make([]result, len(results)/n)
		maximum = make([]result, len(results)/n)
		best    packing.SearchResult // лучше результат среди всех
	)
	for i := range average {
		var (
			timeSum  int64   = 0
			valueSum float64 = 0
			maxValue float64 = 0
		)
		for j := i * n; j < (i+1)*n; j++ {
			result := results[j]
			timeSum += result.Time
			valueSum += result.Value
			if maxValue < result.Value {
				maxValue = result.Value
			}
			if result.BetterThan(best) {
				best = result.SearchResult
			}
		}

		average[i] = result{
			GASettings: packing.GASettings{
				Np: results[i*n].Np,
				Ni: results[i*n].Ni,
				Mp: results[i*n].Mp,
			},
			Time:  timeSum / n,
			Value: valueSum / n,
		}
		maximum[i] = result{
			GASettings: packing.GASettings{
				Np: results[i*n].Np,
				Ni: results[i*n].Ni,
				Mp: results[i*n].Mp,
			},
			Time:  timeSum / n,
			Value: maxValue,
		}
	}

	saveIntoJSON(resultPath+"/results_old.json", results)
	saveIntoJSON(resultPath+"/average.json", average)
	saveIntoJSON(resultPath+"/maximum.json", maximum)
	saveIntoJSON(resultPath+"/bestResult.json", best)
	fmt.Printf("%v", time.Now().Sub(timeStart))
}

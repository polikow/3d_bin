package main

import (
	"3d_bin/packing"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"runtime"
	"sort"
	"sync"
	"time"
)

type input struct {
	index int

	container packing.Container
	blocks    []packing.Block
	np        int
	ni        int
	ci        float64
}

type result struct {
	index int

	r packing.SearchResult

	Np    int     `json:"np"`
	Ni    int     `json:"ni"`
	Ci    float64 `json:"ci"`
	Time  int64   `json:"time"` // время вычисления в миллисекундах
	Value float64 `json:"value"`
}

func (r result) String() string {
	seconds := float64(r.Time) / 1000
	return fmt.Sprintf(
		"%6.4g, %6.2g sec. (np=%2d, ni=%3d, ci=%5.3g)",
		r.Value, seconds, r.Np, r.Ni, r.Ci)
}

type resultArr []result

func (r resultArr) Len() int { return len(r) }

func (r resultArr) Less(i, j int) bool { return r[i].index < r[j].index }

func (r resultArr) Swap(i, j int) { r[i], r[j] = r[j], r[i] }

func sortResults(results []result) {
	sort.Sort(resultArr(results))
}

func worker(jobs <-chan input, results chan<- result, wg *sync.WaitGroup) {
	wg.Add(1)
	for j := range jobs {
		container, blocks, np, ni, ci := j.container, j.blocks, j.np, j.ni, j.ci
		index := j.index
		random := packing.NewRandomSeeded()
		bca := packing.NewBCA(container, blocks, np, ni, ci, random)

		searchResult, milliseconds := packing.EvaluateTimed(bca)

		results <- result{
			index: index,

			r: searchResult,

			Np:    np,
			Ni:    ni,
			Ci:    ci,
			Time:  milliseconds,
			Value: searchResult.Value,
		}
	}
	wg.Done()
}

func aggregator(resultsCh <-chan result, results *[]result) {
	for r := range resultsCh {
		fmt.Printf("%5d) %s\n", len(*results)+1, r)
		*results = append(*results, r)
	}
}

func main() {
	const (
		n          = 150 // количество запусков для одних и тех же параметров
		taskPath   = "/home/aleksey/3d_bin/saved/47blocks.json"
		resultPath = "/home/aleksey/3d_bin/research/bca"

		npStart, npStop, npStep = 10, 10, 10
		niStart, niStop, niStep = 50, 400, 50
		ciStart, ciStop, ciStep = 3, 3, 3
	)

	var (
		jobs      = make(chan input, 100)
		resultsCh = make(chan result, 100)
		wg        = new(sync.WaitGroup)
		results   []result
		timeStart = time.Now()
	)
	runtime.GOMAXPROCS(runtime.NumCPU())
	for i := 0; i < runtime.NumCPU(); i++ {
		go worker(jobs, resultsCh, wg)
	}
	go aggregator(resultsCh, &results)

	var (
		container, blocks = packing.LoadTaskFromJSON(taskPath)

		// исследуемые параметры
		np int
		ni int
		ci float64
	)

	index := 0
	for np = npStart; np <= npStop; np += npStep {
		for ni = niStart; ni <= niStop; ni += niStep {
			for ci = ciStart; ci <= ciStop; ci += ciStep {
				for i := 0; i < n; i++ {
					jobs <- input{
						index:     index,
						container: container,
						blocks:    blocks,
						np:        np,
						ni:        ni,
						ci:        ci,
					}
					index++
				}
			}
		}
	}
	close(jobs)
	wg.Wait()
	time.Sleep(time.Second * 10) //todo пофиксить
	close(resultsCh)

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
			if result.r.BetterThan(best) {
				best = result.r
			}
		}

		average[i] = result{
			Np:    results[i*n].Np,
			Ni:    results[i*n].Ni,
			Ci:    results[i*n].Ci,
			Time:  timeSum / n,
			Value: valueSum / n,
		}
		maximum[i] = result{
			Np:    results[i*n].Np,
			Ni:    results[i*n].Ni,
			Ci:    results[i*n].Ci,
			Time:  timeSum / n,
			Value: maxValue,
		}
	}

	saveIntoJSON(resultPath+"/results.json", results)
	saveIntoJSON(resultPath+"/average.json", average)
	saveIntoJSON(resultPath+"/maximum.json", maximum)
	saveIntoJSON(resultPath+"/bestResult.json", best)
	fmt.Printf("%v", time.Now().Sub(timeStart))
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

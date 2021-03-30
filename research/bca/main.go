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
		start := time.Now()
		searchResult := packing.Evaluate(bca)
		timeTook := time.Now().Sub(start).Milliseconds()
		value := searchResult.Value
		results <- result{
			index: index,

			r: searchResult,

			Np:    np,
			Ni:    ni,
			Ci:    ci,
			Time:  timeTook,
			Value: value,
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
		n = 2 // количество запусков для одних и тех же параметров

		npStart, npStop, npStep = 5, 20, 5
		niStart, niStop, niStep = 25, 25, 25
		ciStart, ciStop, ciStep = 0.05, 2, 0.15
	)

	var (
		jobs      = make(chan input, 100)
		resultsCh = make(chan result, 100)
		wg        = new(sync.WaitGroup)
		results   = make([]result, 0, 1000)
	)
	runtime.GOMAXPROCS(runtime.NumCPU())
	for i := 0; i < runtime.NumCPU(); i++ {
		go worker(jobs, resultsCh, wg)
	}
	go aggregator(resultsCh, &results)

	var (
		container = packing.Container{
			Width:  50,
			Height: 50,
			Length: 50,
		}
		blocks = packing.GenerateRandomBlocks(
			packing.NewRandomSeeded(),
			container,
		)

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

	saveIntoJSON("/home/aleksey/3d_bin/research/bca/results.json", results)
	saveIntoJSON("/home/aleksey/3d_bin/research/bca/average.json", average)
	saveIntoJSON("/home/aleksey/3d_bin/research/bca/maximum.json", maximum)
	saveIntoJSON("/home/aleksey/3d_bin/research/bca/bestResult.json", best)
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
package main

import (
	"3d_bin/packing"
	"encoding/json"
	"fmt"
	"os"
)

type result struct {
	Size  int     `json:"size"`
	Value float64 `json:"value"`
}

func main() {
	const (
		path     = "/home/aleksey/3d_bin/research/comparison/data"
		savePath = "/home/aleksey/3d_bin/research/comparison/value"
		runs     = 100 // запусков для каждой задачи

		bcaNp = 15
		bcaNi = 500
		bcaCi = 2.7

		gaNp = 100
		gaNi = 500
		gaMp = 0.13
	)
	taskSizes := [...]int{10, 30, 40, 60, 80, 100, 150, 200}

	results := struct {
		BCA       []result `json:"bca"`
		GADarwin  []result `json:"gaDarwin"`
		GADeVries []result `json:"gaDeVries"`
	}{
		BCA:       make([]result, len(taskSizes)*runs),
		GADarwin:  make([]result, len(taskSizes)*runs),
		GADeVries: make([]result, len(taskSizes)*runs),
	}

	// bca
	for i, size := range taskSizes {
		taskPath := fmt.Sprintf("%s/%d.json", path, size)
		container, blocks := packing.LoadTaskFromJSON(taskPath)

		for j := 0; j < runs; j++ {
			random := packing.NewRandomSeeded()
			index := j + (i * runs)

			bca := packing.NewBCA(container, blocks, bcaNp, bcaNi, bcaCi, random)
			searchResult := packing.Evaluate(bca)
			results.BCA[index].Size = size
			results.BCA[index].Value = searchResult.Value
			fmt.Printf("%4d) size = %3d, value = %.4g [BCA]\n", index, size, searchResult.Value)
		}
	}

	// gaDarwin
	for i, size := range taskSizes {
		taskPath := fmt.Sprintf("%s/%d.json", path, size)
		container, blocks := packing.LoadTaskFromJSON(taskPath)

		for j := 0; j < runs; j++ {
			random := packing.NewRandomSeeded()
			index := j + (i * runs)

			darwin := new(packing.DarwinEvolution)
			gaDarwin := packing.NewGA(container, blocks, gaNp, gaMp, gaNi, darwin, random)
			searchResult := packing.Evaluate(gaDarwin)
			results.GADarwin[index].Size = size
			results.GADarwin[index].Value = searchResult.Value
			fmt.Printf("%4d) size = %3d, value = %.4g [Darwin]\n", index, size, searchResult.Value)
		}
	}

	// gaDeVries
	for i, size := range taskSizes {
		taskPath := fmt.Sprintf("%s/%d.json", path, size)
		container, blocks := packing.LoadTaskFromJSON(taskPath)

		for j := 0; j < runs; j++ {
			random := packing.NewRandomSeeded()
			index := j + (i * runs)

			deVries := new(packing.DeVriesEvolution)
			gaDeVries := packing.NewGA(container, blocks, gaNp, gaMp, gaNi, deVries, random)
			searchResult := packing.Evaluate(gaDeVries)
			results.GADeVries[index].Size = size
			results.GADeVries[index].Value = searchResult.Value
			fmt.Printf("%4d) size = %3d, value = %.4g [DeVries]\n", index, size, searchResult.Value)
		}
	}

	data, _ := json.Marshal(results)
	_ = os.WriteFile(fmt.Sprintf("%s/results_old.json", savePath), data, 0644)
}
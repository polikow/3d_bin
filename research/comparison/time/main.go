package main

import (
	"3d_bin/packing"
	"encoding/json"
	"fmt"
	"os"
)

type result struct {
	Size int   `json:"size"`
	Time int64 `json:"time"`
}

func main() {
	const (
		path     = "/home/aleksey/3d_bin/research/comparison/data"
		savePath = "/home/aleksey/3d_bin/research/comparison/time"
		runs     = 10 // запусков для каждой задачи

		bcaNp = 10
		bcaNi = 2000
		bcaCi = 2.7

		gaNp = 100
		gaNi = 2000
		gaMp = 0.24
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
			_, milliseconds := packing.EvaluateTimedLimited(bca, bcaNi)
			results.BCA[index].Size = size
			results.BCA[index].Time = milliseconds
			fmt.Printf("%4d) size = %3d, time = %4d [BCA]\n", index, size, milliseconds)
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
			_, milliseconds := packing.EvaluateTimedLimited(gaDarwin, gaNi)
			results.GADarwin[index].Size = size
			results.GADarwin[index].Time = milliseconds
			fmt.Printf("%4d) size = %3d, time = %4d [Darwin]\n", index, size, milliseconds)
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
			_, milliseconds := packing.EvaluateTimedLimited(gaDeVries, gaNi)
			results.GADeVries[index].Size = size
			results.GADeVries[index].Time = milliseconds
			fmt.Printf("%4d) size = %3d, time = %4d [DeVries]\n", index, size, milliseconds)
		}
	}

	data, _ := json.Marshal(results)
	_ = os.WriteFile(fmt.Sprintf("%s/results.json", savePath), data, 0644)
}

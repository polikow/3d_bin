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
		task, err := packing.LoadTaskFromJSONFile(taskPath)
		if err != nil {
			panic(err)
		}

		for j := 0; j < runs; j++ {
			index := j + (i * runs)

			bca := packing.NewBCA(task, packing.BCASettings{
				Np:     bcaNp,
				Ni:     bcaNi,
				Ci:     bcaCi,
				Random: packing.NewRandomSeeded(),
			})
			_, milliseconds := packing.EvaluateTimedLimited(bca, bcaNi)
			results.BCA[index].Size = size
			results.BCA[index].Time = milliseconds
			fmt.Printf("%4d) size = %3d, time = %4d [BCA]\n", index, size, milliseconds)
		}
	}

	// gaDarwin
	for i, size := range taskSizes {
		taskPath := fmt.Sprintf("%s/%d.json", path, size)
		task, err := packing.LoadTaskFromJSONFile(taskPath)
		if err != nil {
			panic(err)
		}

		for j := 0; j < runs; j++ {
			index := j + (i * runs)
			gaDarwin := packing.NewGA(task, packing.GASettings{
				Np:        gaNp,
				Mp:        gaMp,
				Ni:        gaNi,
				Evolution: new(packing.DarwinEvolution),
				Random:    packing.NewRandomSeeded(),
			})
			_, milliseconds := packing.EvaluateTimedLimited(gaDarwin, gaNi)
			results.GADarwin[index].Size = size
			results.GADarwin[index].Time = milliseconds
			fmt.Printf("%4d) size = %3d, time = %4d [Darwin]\n", index, size, milliseconds)
		}
	}

	// gaDeVries
	for i, size := range taskSizes {
		taskPath := fmt.Sprintf("%s/%d.json", path, size)
		task, err := packing.LoadTaskFromJSONFile(taskPath)
		if err != nil {
			panic(err)
		}

		for j := 0; j < runs; j++ {
			index := j + (i * runs)
			gaDeVries := packing.NewGA(task, packing.GASettings{
				Np:        gaNp,
				Mp:        gaMp,
				Ni:        gaNi,
				Evolution: new(packing.DeVriesEvolution),
				Random:    packing.NewRandomSeeded(),
			})
			_, milliseconds := packing.EvaluateTimedLimited(gaDeVries, gaNi)
			results.GADeVries[index].Size = size
			results.GADeVries[index].Time = milliseconds
			fmt.Printf("%4d) size = %3d, time = %4d [DeVries]\n", index, size, milliseconds)
		}
	}

	data, _ := json.Marshal(results)
	_ = os.WriteFile(fmt.Sprintf("%s/results_old.json", savePath), data, 0644)
}

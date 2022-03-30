package packing

import (
	"encoding/json"
	"math"
	"os"
)

func ceilMultiplication(i int, f float64) int {
	return int(math.Ceil(float64(i) * f))
}

func ceilMultiplicationUINT(u uint, f float64) uint {
	return uint(math.Ceil(float64(u) * f))
}

func ceilDivision(i int, f float64) int {
	return int(math.Ceil(float64(i) / f))
}

func loadFromJSONFile[T any](path string) (t T, err error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return t, err
	}

	err = json.Unmarshal(data, &t)
	if err != nil {
		return t, err
	}
	return t, nil
}

func saveAsJSONFile[T any](path string, t T) error {
	bytes, err := json.Marshal(t)
	if err != nil {
		return err
	}

	err = os.WriteFile(path, bytes, 0666)
	if err != nil {
		return err
	}
	return nil
}

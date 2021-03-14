package packing

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestBCA(t *testing.T) {
	container := Container{Width: 3, Height: 4, Length: 3}
	blocks := []Block{
		{Width: 1, Height: 2, Length: 3},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 2, Length: 1},

		{Width: 2, Height: 2, Length: 1},
		{Width: 2, Height: 2, Length: 2},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 1, Length: 1},
		{Width: 1, Height: 2, Length: 1},

		{Width: 2, Height: 2, Length: 1},
		{Width: 2, Height: 2, Length: 2},
	}

	fmt.Printf("blocks volume: %d\n", BlocksVolume(blocks))
	fmt.Printf("container volume: %d\n", container.Volume())

	bca := NewBCA(container, blocks, 5, 500, 1)

	//runOnlyBetter := StepByStepBetter(bca)
	//for {
	//	result, stillRunning := runOnlyBetter()
	//	fmt.Printf("result: %.5g , %v\n", result.Value, result.Solution)
	//	if !stillRunning {
	//		break
	//	}
	//}
	result := EvaluatePrintBetter(bca)
	assert.Equalf(t, result.Value, fill(result.Packed, container), "wrong packed implementation")
}

func fill(positions []BlockPosition, container Container) float64 {
	return float64(blockPositionsVolume(positions)) / float64(container.Volume())
}

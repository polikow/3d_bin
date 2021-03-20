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

	result := EvaluatePrintBetter(bca)
	assert.Equalf(t, result.Value, fill(result.Packed, container), "wrong packed implementation")
}

func TestMakeCloneInDst(t *testing.T) {
	antibodySize := 10

	antibodies := make([]Antibody, 1, 5)
	for i := range antibodies {
		antibodies[i] = newAntibody(antibodySize)
	}

	clones := make([]Antibody, 1, 1)
	clones[0] = make(Antibody, antibodySize)

	assert.Panics(t, func() {
		antibodies[0].makeCloneInDestination(clones[1])
	}, "the code didn't panic, but it should've panicked!")

	assert.Panics(t, func() {
		antibodies[1].makeCloneInDestination(clones[0])
	}, "the code didn't panic, but it should've panicked!")

	assert.NotPanics(t, func() {
		antibodies[0].makeCloneInDestination(clones[0])
	}, "the code panicked, but it shouldn't have panicked!")
}

func fill(positions []BlockPosition, container Container) float64 {
	return float64(blockPositionsVolume(positions)) / float64(container.Volume())
}

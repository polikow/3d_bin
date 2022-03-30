package packing

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestBCA(t *testing.T) {
	task := newTask(
		Container{Width: 3, Height: 4, Length: 3},
		[]Block{
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
		},
	)

	bca := NewBCA(task, BCASettings{Np: 5, Ni: 500, Ci: 1})
	EvaluatePrintBetter(bca)
}

func TestMakeCloneInDst(t *testing.T) {
	antibodySize := 10
	random := NewRandomSeeded()

	antibodies := make([]Antibody, 1, 5)
	for i := range antibodies {
		antibodies[i] = newAntibody(random, antibodySize)
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

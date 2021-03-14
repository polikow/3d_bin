package packing

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNewAntibody(t *testing.T) {
	antibodySize := 10

	for i := 0; i < 100; i++ {
		antibody := newAntibody(antibodySize)
		for _, value := range antibody {
			rotation := value.Rotation
			if rotation > YXZ || rotation < XYZ {
				assert.Fail(t, "the rotation is wrong: ", rotation)
			}
			index := value.Index
			if index >= antibodySize || index < 0 {
				assert.Failf(
					t, "", "the index (%v) is wrong: (must be between in [0, %v))",
					index, antibodySize,
				)
			}
		}
	}
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

package packing

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestShape3D(t *testing.T) {
	suite := []struct {
		shape    Shape3d
		expected uint
	}{
		{shape: Block{1, 1, 1}, expected: 1},
		{shape: Block{2, 3, 4}, expected: 24},
		{shape: Container{1, 1, 1}, expected: 1},
	}

	for _, test := range suite {
		assert.Equal(t, test.expected, VolumeOf(test.shape), "Wrong interface implementation")
	}
}

func TestOverlapping(t *testing.T) {
	notOverlapping := []BlockPosition{
		{P1: Point{1, 1, 1}, P2: Point{2, 2, 2}},
		{P1: Point{1, 1, 0}, P2: Point{2, 2, 1}},
		{P1: Point{1, 0, 1}, P2: Point{2, 1, 2}},
		{P1: Point{1, 0, 0}, P2: Point{2, 1, 1}},
		{P1: Point{0, 1, 1}, P2: Point{1, 2, 2}},
		{P1: Point{0, 1, 0}, P2: Point{1, 2, 1}},
		{P1: Point{0, 0, 1}, P2: Point{1, 1, 2}},
		{P1: Point{0, 0, 0}, P2: Point{1, 1, 1}},
	}
	for i := range notOverlapping {
		for j := range notOverlapping {
			pos1 := notOverlapping[i]
			pos2 := notOverlapping[j]
			if i != j {
				assert.Falsef(t, pos1.overlapping(pos2), "%v %v ARE NOT overlapping", pos1, pos2)
				assert.Falsef(t, pos2.overlapping(pos1), "%v %v ARE NOT overlapping", pos2, pos1)
			} else {
				assert.Truef(t, pos1.overlapping(pos2), "%v and %v ARE overlapping", pos1, pos2)
				assert.Truef(t, pos2.overlapping(pos1), "%v and %v ARE overlapping", pos2, pos1)
			}
		}
	}

	overlappingPairs := []BlockPosition{
		{P1: Point{0, 0, 0}, P2: Point{2, 2, 2}},
		{P1: Point{1, 1, 0}, P2: Point{2, 2, 1}},
	}
	for i := 0; i < len(overlappingPairs); i += 2 {
		pos1 := overlappingPairs[i]
		pos2 := overlappingPairs[i+1]
		assert.Truef(t, pos1.overlapping(pos2), "%v and %v ARE overlapping", pos1, pos2)
		assert.Truef(t, pos2.overlapping(pos1), "%v and %v ARE overlapping", pos2, pos1)
	}
}

func TestRandomSolution(t *testing.T) {
	size := 10
	random := NewRandomSeeded()

	for i := 0; i < 100; i++ {
		solution := newRandomSolution(random, size)
		for _, value := range solution {
			rotation := value.Rotation
			if rotation > YXZ || rotation < XYZ {
				assert.Fail(t, "the rotation is wrong: ", rotation)
			}
			index := value.Index
			if index >= size || index < 0 {
				assert.Failf(
					t, "", "the index (%v) is wrong: (must be between in [0, %v))",
					index, size,
				)
			}
		}
	}
}

func TestAxisSize(t *testing.T) {
	suite := []struct {
		position BlockPosition
		axis     Axis
		expected uint
	}{
		{BlockPosition{P1: Point{1, 2, 3}, P2: Point{2, 3, 4}}, X, 1},
		{BlockPosition{P1: Point{1, 2, 3}, P2: Point{2, 3, 4}}, Y, 1},
		{BlockPosition{P1: Point{1, 2, 3}, P2: Point{2, 3, 4}}, Z, 1},
	}

	for _, test := range suite {
		position := test.position
		axis := test.axis
		expected := test.expected
		size := position.axisSize(axis)
		assert.Equal(t, expected, size)
	}
}

func TestGenerateRandomBlocks(t *testing.T) {
	container := Container{
		Width:  2,
		Height: 2,
		Length: 2,
	}
	random := NewRandomSeeded()
	blocks := GenerateRandomBlocks(random, container)
	fmt.Println(blocks)
}

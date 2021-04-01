package packing

import (
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestPackAlgorithm(t *testing.T) {
	suit := []struct {
		container   Container
		blocks      []Block
		solution    Solution
		packedCount int
	}{
		{
			Container{Width: 2, Height: 2, Length: 2},
			[]Block{
				{Width: 2, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
				{Width: 1, Height: 1, Length: 1},
			},
			Solution{
				IndexRotation{Index: 0, Rotation: 0},
				IndexRotation{Index: 1, Rotation: 0},
				IndexRotation{Index: 2, Rotation: 0},
				IndexRotation{Index: 3, Rotation: 0},
				IndexRotation{Index: 4, Rotation: 0},
				IndexRotation{Index: 5, Rotation: 0},
				IndexRotation{Index: 6, Rotation: 0},
				IndexRotation{Index: 7, Rotation: 0},
			},
			7,
		},

		{
			Container{Width: 2, Height: 2, Length: 2},
			[]Block{
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
			},
			Solution{
				IndexRotation{Index: 4, Rotation: 5},
				IndexRotation{Index: 1, Rotation: 3},
				IndexRotation{Index: 6, Rotation: 1},
				IndexRotation{Index: 5, Rotation: 5},
				IndexRotation{Index: 7, Rotation: 3},
				IndexRotation{Index: 2, Rotation: 4},
				IndexRotation{Index: 0, Rotation: 5},
				IndexRotation{Index: 3, Rotation: 5},
			},
			8,
		},

		{
			Container{Width: 2, Height: 2, Length: 2},
			[]Block{
				{1, 1, 1},
				{1, 1, 1},
				{2, 1, 1},
			},
			Solution{
				IndexRotation{Index: 0, Rotation: 0},
				IndexRotation{Index: 1, Rotation: 0},
				IndexRotation{Index: 2, Rotation: 0},
			},
			3,
		},


		{
			Container{Width: 2, Height: 2, Length: 2},
			[]Block{
				{1, 1, 1},
				{1, 1, 1},
				{2, 1, 1},
				{1, 1, 2},
				{1, 1, 2},
			},
			Solution{
				IndexRotation{Index: 0, Rotation: 0},
				IndexRotation{Index: 1, Rotation: 0},
				IndexRotation{Index: 2, Rotation: 0},
				IndexRotation{Index: 3, Rotation: 0},
				IndexRotation{Index: 4, Rotation: 0},
			},
			5,
		},

		{
			Container{Width: 2, Height: 2, Length: 3},
			[]Block{
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
			},
			Solution{
				IndexRotation{Index: 0, Rotation: 0},
				IndexRotation{Index: 1, Rotation: 0},
				IndexRotation{Index: 2, Rotation: 0},
				IndexRotation{Index: 3, Rotation: 0},
				IndexRotation{Index: 4, Rotation: 0},
				IndexRotation{Index: 5, Rotation: 0},
				IndexRotation{Index: 6, Rotation: 0},
				IndexRotation{Index: 7, Rotation: 0},
				IndexRotation{Index: 8, Rotation: 0},
			},
			9,
		},

		{
			Container{Width: 2, Height: 3, Length: 2},
			[]Block{
				{1, 3, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1},
			},
			Solution{
				IndexRotation{Index: 0, Rotation: 0},
				IndexRotation{Index: 1, Rotation: 0},
				IndexRotation{Index: 2, Rotation: 0},
				IndexRotation{Index: 3, Rotation: 0},
				IndexRotation{Index: 4, Rotation: 0},
				IndexRotation{Index: 5, Rotation: 0},
				IndexRotation{Index: 6, Rotation: 0},
			},
			7,
		},
	}

	for _, test := range suit {
		container := test.container
		blocks := test.blocks
		solution := test.solution
		a := NewPackAlgorithm(container, blocks)

		positions := a.Run(solution)

		for i, position := range positions {
			jsonPosition, _ := json.Marshal(position)
			fmt.Printf("%v) %s\n", i, jsonPosition)
		}
		fmt.Println()
		for i, position1 := range positions {
			for j, position2 := range positions {
				if i != j {
					overlapping := position1.overlapping(position2)
					assert.Falsef(t, overlapping, "%v and %v are overlapping!", i, j)
				}
			}
		}

		assert.Truef(t, len(positions) == test.packedCount,
			"packed %v instead of %v",
			len(positions), test.packedCount)
	}
}

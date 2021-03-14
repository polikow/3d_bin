package packing

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestInsert(t *testing.T) {
	s := make([]uint, 0, 5)
	for _, value := range []uint{1, 3, 4, 5} {
		s = append(s, value)
	}
	expected := []uint{1, 2, 3, 4, 5}

	oldAddress := &s
	insertUINT(&s, 1, 2)
	assert.Equal(t, oldAddress, &s)
	assert.Equal(t, expected, s)
}

func TestShuffleUINT(t *testing.T) {
	s := make([]uint, 5)
	for i := 0; i < cap(s); i++ {
		s[i] = uint(i)
	}
	expected := make([]uint, 5)
	copy(expected, s)

	assert.Equal(t, expected, s)
}

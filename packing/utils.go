package packing

import (
	"crypto/rand"
	"errors"
	"math/big"
)

//insertUINT выполняет вставку элемента на место index.
//Все элементы, начиная с index до последнего смещаются вправо.
func insertUINT(s *[]uint, index int, value uint) {
	if len(*s) == cap(*s) {
		panic("not enough capacity")
	}

	*s = append(*s, 0)
	copy((*s)[index+1:], (*s)[index:])
	(*s)[index] = value
}

//insertBOOL выполняет вставку элемента на место index.
//Все элементы, начиная с index до последнего смещаются вправо.
func insertBOOL(s *[]bool, index int, value bool) {
	if len(*s) == cap(*s) {
		panic("not enough capacity")
	}

	*s = append(*s, false)
	copy((*s)[index+1:], (*s)[index:])
	(*s)[index] = value
}

//shuffleUINT выполняет перемешивание элементов массива.
func shuffleUINT(slice []uint) error {
	b := new(big.Int)
	for i := len(slice) - 1; i >= 0; i-- {
		b = b.SetInt64(int64(i + 1))
		j, err := rand.Int(rand.Reader, b)
		if err != nil {
			return err
		}
		if i != int(j.Int64()) {
			slice[int(j.Int64())], slice[i] = slice[i], slice[int(j.Int64())]
		}
	}
	return nil
}

func makeShuffledUINT(original []uint) ([]uint, error) {
	slice := make([]uint, len(original))
	copied := copy(slice, original)
	if copied != len(original) {
		return nil, errors.New("failed to copy original slice")
	}
	err := shuffleUINT(slice)
	if err != nil {
		return nil, errors.New("failed to shuffle")
	}

	return slice, nil
}
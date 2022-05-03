package packing

import (
	"errors"
	"fmt"
)

var ErrInvalidSearchResult = errors.New("invalid result")

// SearchResult - результат работы алгоритма, где:
//  Iteration - итерация, на которой был найден,
//  Value     - лучшее значение цф за все итерации,
//  Solution  - найденное решение (порядок упаковки),
//  Packed    - позиции упакованных грузов.
type SearchResult struct {
	Iteration int             `json:"iteration"`
	Value     float64         `json:"value"`
	Solution  Solution        `json:"solution"`
	Packed    []BlockPosition `json:"packed"`
}

func (s SearchResult) BetterThan(other SearchResult) bool {
	return s.Value >= other.Value
}

func (s SearchResult) IsValidFor(task Task) (valid bool, err error) {
	defer func() {
		if r := recover(); r != nil {
			valid = false
			e, ok := r.(error)
			if ok {
				err = e
			} else {
				err = ErrInvalidSearchResult
			}
		}
	}()

	if isSane, err := s.Solution.isSane(task); !isSane {
		return false, err
	}

	packed := NewPackAlgorithm(task).Run(s.Solution)
	if len(packed) != len(s.Packed) {
		return false, fmt.Errorf("%w: packed does not match", ErrInvalidSearchResult)
	}
	for i := 0; i < len(packed); i++ {
		if packed[i] != s.Packed[i] {
			return false, fmt.Errorf("%w: packed does not match", ErrInvalidSearchResult)
		}
	}

	if float64(VolumeOf(packed...))/float64(VolumeOf(task.Container)) != s.Value {
		return false, fmt.Errorf("%w: value does not match", ErrInvalidSearchResult)
	}

	return valid, nil
}

func SaveSearchResultIntoJSONFile(path string, result SearchResult) error {
	return saveAsJSONFile(path, result)
}

func LoadSearchResultFromJSONFile(path string) (SearchResult, error) {
	return loadFromJSONFile[SearchResult](path) // TODO add sanity check
}

package packing

// SearchResult - результат работы одной итерации алгоритма, где:
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

func SaveSearchResultIntoJSONFile(path string, result SearchResult) error {
	return saveAsJSONFile(path, result)
}

func LoadSearchResultFromJSONFile(path string) (SearchResult, error) {
	return loadFromJSONFile[SearchResult](path) // TODO add sanity check
}

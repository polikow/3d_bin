package packing

// Progresser - алгоритм, для которого известен его прогресс.
type Progresser interface {
	Progress() Progress
}

// Progress - состояние работы алгоритма
type Progress struct {
	StepsDone  int `json:"stepsDone"`  // число выполненных шагов
	StepsTotal int `json:"stepsTotal"` // число шагов до полного выполнения
}

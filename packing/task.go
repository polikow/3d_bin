package packing

import (
	"errors"
	"fmt"
)

var ErrInvalidTask = errors.New("invalid task")

// Task - условия задачи
type Task struct {
	Container Container `json:"container"` // контейнер
	Blocks    []Block   `json:"blocks"`    // загружаемые в контейнер грузы
}

func newTask(container Container, blocks []Block) Task {
	task := Task{Container: container, Blocks: blocks}
	task.mustBeSane()
	return task
}

// Size возвращает размер задачи (количество загружаемых грузов)
func (t Task) Size() int { return len(t.Blocks) }

// isSane проверяет корректность задачи.
func (t Task) isSane() (bool, error) {
	if len(t.Blocks) == 0 {
		return false, fmt.Errorf("%w: no blocks", ErrInvalidTask)
	}
	if VolumeOf(t.Container) == 0 {
		return false, fmt.Errorf("%w: container is not sane", ErrInvalidTask)
	}
	for _, block := range t.Blocks {
		if VolumeOf(block) == 0 {
			return false, fmt.Errorf("%w: block \"%v\" is not sane", ErrInvalidTask, block)
		}
	}
	return true, nil
}

func (t Task) mustBeSane() {
	if _, err := t.isSane(); err != nil {
		panic(err)
	}
}

// SaveTaskIntoJSONFile сохраняет задачу в файл по заданному пути.
func SaveTaskIntoJSONFile(path string, task Task) error {
	return saveAsJSONFile(path, task)
}

// LoadTaskFromJSONFile загружает задачу из файла по заданному пути.
func LoadTaskFromJSONFile(path string) (task Task, err error) {
	task, err = loadFromJSONFile[Task](path)
	if err != nil {
		return Task{}, err
	}
	if _, err = task.isSane(); err != nil {
		return Task{}, err
	}
	return task, nil
}

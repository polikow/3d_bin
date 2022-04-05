package packing

import "github.com/pkg/errors"

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

func (t Task) isSane() (bool, error) {
	if VolumeOf(t.Container) == 0 {
		return false, errors.New("container is not sane")
	}
	for _, block := range t.Blocks {
		if VolumeOf(block) == 0 {
			return false, errors.Errorf("block \"%v\" is not sane", block)
		}
	}
	return true, nil
}

func (t Task) mustBeSane() {
	if _, err := t.isSane(); err != nil {
		panic(err)
	}
}

func SaveTaskIntoJSONFile(path string, task Task) error {
	return saveAsJSONFile(path, task)
}

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

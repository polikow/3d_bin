package internal

import (
	"3d_bin/packing"
	"encoding/json"
	"github.com/pkg/errors"
	"github.com/wailsapp/wails"
	"os"
)

type App struct {
	runtime *wails.Runtime
	logger  *wails.CustomLogger
}

func (a *App) WailsInit(r *wails.Runtime) error {
	a.runtime = r
	a.logger = a.runtime.Log.New("APP")
	return nil
}

// RunAlgorithm запускает выполнение заданного алгоритма.
//
// Возвращает true, если алгоритм был успешно запущен.
func (a *App) RunAlgorithm(data []byte) bool {
	algorithm, err := a.parseAlgorithmSettings(data)
	if err != nil {
		a.logger.Error(err.Error())
		return false
	}
	a.evaluate(algorithm)
	return true
}

// parseAlgorithmSettings парсит настройки алгоритма и возвращает экземпляр
// подходящего алгоритма поиска с заданными настройками.
func (a *App) parseAlgorithmSettings(data []byte) (_ packing.SearchAlgorithm, e error) {
	algorithm := struct {
		Type string `json:"algorithm_type"`
	}{}
	if err := json.Unmarshal(data, &algorithm); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal algorithm type")
	}

	defer func() {
		if r := recover(); r != nil {
			switch r.(type) {
			case error:
				e = errors.Wrap(r.(error), "failed to create algorithm instance")
			default:
				e = errors.Errorf("internal failure: %v", r.(error))
			}
		}
	}()

	switch algorithm.Type {
	case "bca":
		b := struct {
			Container packing.Container `json:"container"`
			Blocks    []packing.Block   `json:"blocks"`
			Np        int               `json:"np"`
			Ni        int               `json:"ni"`
			Ci        float64           `json:"ci"`
		}{}
		if err := json.Unmarshal(data, &b); err != nil {
			return nil, errors.Wrap(err, "failed to unmarshal bca algorithm")
		}
		return packing.NewBCA(
			b.Container,
			b.Blocks,
			b.Np,
			b.Np,
			b.Ci,
			packing.NewRandomSeeded(),
		), nil

	case "ga":
		g := struct {
			Container packing.Container `json:"container"`
			Blocks    []packing.Block   `json:"blocks"`
			Np        int               `json:"np"`
			Mp        float64           `json:"mp"`
			Ni        int               `json:"ni"`
			Evolution string            `json:"evolution"`
		}{}
		if err := json.Unmarshal(data, &g); err != nil {
			return nil, errors.Wrap(err, "failed to unmarshal ga algorithm")
		}
		var evolution packing.Evolution
		switch g.Evolution {
		case "Darwin":
			evolution = new(packing.DarwinEvolution)
		case "deVries":
			evolution = new(packing.DeVriesEvolution)
		default:
			return nil, errors.Errorf("evolution %q is not supported", g.Evolution)
		}
		return packing.NewGA(
			g.Container,
			g.Blocks,
			g.Np,
			g.Mp,
			g.Ni,
			evolution,
			packing.NewRandomSeeded(),
		), nil

	default:
		return nil, errors.Errorf("algorithm_type %q is not supported", algorithm.Type)
	}
}

// evaluate полностью выполняет алгоритм и возвращает результат через
// событие "result"
func (a *App) evaluate(algorithm packing.SearchAlgorithm) {
	result := packing.Evaluate(algorithm)
	a.runtime.Events.Emit("result", result)
}

//Save отображает диалоговое окно, в котором пользователь выбирает файл,
//в который необходимо сохранить некоторые данные.
//
//  title  - название диалогового окна,
//  filter - фильтр по допустимому расширению файла,
//  data   - данные в формате json, которые необходимо сохранить в файл.
func (a *App) Save(title, filter, data string) error {
	selected := a.runtime.Dialog.SelectSaveFile(title, filter)
	if selected == "" {
		return errors.New("no file was selected")
	}
	if selected[len(selected)-5:] != ".json" {
		selected = selected + ".json"
	}
	a.logger.Infof("%v was selected to save into", selected)
	if err := os.WriteFile(selected, []byte(data), 0666); err != nil {
		a.logger.Errorf("failed to save into %v", selected)
		return err
	}
	return nil
}

//Load отображает диалоговое окно, в котором пользователь выбирает файл,
//из которого необходимо загрузить данные.
//
//  title  - название диалогового окна,
//  filter - фильтр по допустимому расширению файла,
//
//Возвращает считанное содержимое json файла в виде строки.
func (a *App) Load(title, filter string) (string, error) {
	selectedFile := a.runtime.Dialog.SelectFile(title, filter)
	if selectedFile == "" {
		return "", errors.New("no file was selected")
	}

	a.logger.Infof("%v was selected to load from", selectedFile)
	bytes, err := os.ReadFile(selectedFile)
	if err != nil {
		return "", err
	}
	return string(bytes), err
}

// Generate генерирует случайные грузы для заданного контейнера.
func (a *App) Generate(data []byte) ([]packing.Block, error) {
	var c packing.Container
	if err := json.Unmarshal(data, &c); err != nil {
		return nil, err
	}
	return packing.GenerateRandomBlocks(packing.NewRandomSeeded(), c), nil
}

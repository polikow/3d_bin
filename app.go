package main

import (
	"3d_bin/packing"
	"encoding/json"
	"errors"
	"github.com/wailsapp/wails"
	"github.com/wailsapp/wails/lib/logger"
	"io/ioutil"
	"strings"
)

type App struct {
	logger  *wails.CustomLogger
	runtime *wails.Runtime
}

func NewApp() *App {
	return &App{
		logger:  logger.NewCustomLogger("APP"),
		runtime: nil,
	}
}

func (a *App) WailsInit(runtime *wails.Runtime) error {
	a.runtime = runtime
	a.logger = a.runtime.Log.New("App")
	a.logger.Info("App is ready")
	runtime.Events.Emit("ping")
	return nil
}

func (a *App) Test(data string) {
	a.logger.Infof("%v\n", data)
}

// RunAlgorithm запускает выполнение заданного алгоритма.
//
// Возвращает true, если алгоритм был успешно запущен, иначе false.
func (a *App) RunAlgorithm(data []byte) bool {
	var (
		algorithm packing.SearchAlgorithm
		random    = packing.NewRandomSeeded()

		// настройки алгоритма BCA
		b struct {
			Blocks    []packing.Block   `json:"blocks"`
			Container packing.Container `json:"container"`
			Np        int               `json:"np"`
			Ni        int               `json:"ni"`
			Ci        float64           `json:"ci"`
		}

		// настройки генетического алгоритма
		g struct {
			Blocks    []packing.Block   `json:"blocks"`
			Container packing.Container `json:"container"`
			Np        int               `json:"np"`
			Mp        float64           `json:"mp"`
			Ni        int               `json:"ni"`
			Evolution string            `json:"evolution"`
		}
	)

AlgorithmSetup:
	switch {

	case json.Unmarshal(data, &b) == nil:
		container, blocks, np, ni, ci := b.Container, b.Blocks, b.Np, b.Ni, b.Ci
		algorithm = packing.NewBCA(container, blocks, np, ni, ci, random)

	case json.Unmarshal(data, &g) == nil:
		container, blocks, np, mp, ni := g.Container, g.Blocks, g.Np, g.Mp, g.Ni
		var evolution packing.Evolution
		switch g.Evolution {
		case "Дарвина":
			evolution = packing.DarwinEvolution{}
		case "де Фриза":
			evolution = packing.DeVriesEvolution{}
		default:
			break AlgorithmSetup
		}
		algorithm = packing.NewGA(container, blocks, np, mp, ni, evolution, random)

	default:
		break AlgorithmSetup
	}

	if algorithm == nil {
		return false
	} else {
		go a.evaluate(algorithm)
		return true
	}
}

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
func (a App) Save(title, filter, data string) error {
	selectedFile := a.runtime.Dialog.SelectSaveFile(title, filter)
	if selectedFile == "" {
		return errors.New("no file was selected")
	}

	filename := addJSONFormat(selectedFile)
	a.logger.Infof("%v was selected to save into", filename)
	err := ioutil.WriteFile(filename, []byte(data), 0666)
	if err != nil {
		a.logger.Infof("failed to save into %v", filename)
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
func (a App) Load(title, filter string) (string, error) {
	selectedFile := a.runtime.Dialog.SelectFile(title, filter)
	if selectedFile == "" {
		return "", errors.New("no file was selected")
	}

	a.logger.Infof("%v was selected to load from", selectedFile)
	bytes, err := ioutil.ReadFile(selectedFile)
	if err != nil {
		return "", err
	}

	return string(bytes), err
}

//addJSONFormat добавляет расширение .json, если оно не указано.
func addJSONFormat(filename string) string {
	lastDot := strings.LastIndex(filename, ".")
	lastSlash := strings.LastIndex(filename, "/")

	switch {
	case lastDot == -1:
		return filename + ".json"

	case lastSlash < lastDot:
		return filename[:lastDot] + ".json"

	default:
		return filename + ".json"
	}
}

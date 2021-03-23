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

type BCASettings struct {
	Container packing.Container `json:"container"`
	Blocks    []packing.Block   `json:"blocks"`
	Np        int               `json:"np"`
	Ni        int               `json:"ni"`
	Ci        float64           `json:"ci"`
}

type GASettings struct {
	Container packing.Container `json:"container"`
	Blocks    []packing.Block   `json:"blocks"`
	Np        int               `json:"np"`
	Mp        float64           `json:"mp"`
	Ni        int               `json:"ni"`
	Evolution string            `json:"evolution"`
}

// RunAlgorithm запускает выполнение заданного алгоритма.
//
// Возвращает true, если алгоритм был успешно запущен, иначе false.
func (a *App) RunAlgorithm(data []byte) bool {
	var (
		algorithm packing.SearchAlgorithm     // выполняемый алгоритм
		random    = packing.NewRandomSeeded() // генератор случайных чисел

		b BCASettings // настройки алгоритма BCA
		g GASettings  // настройки генетического алгоритма
	)
	a.logger.Infof("AlgorithmSetup")
AlgorithmSetup:
	switch {

	case parseBCASettings(data, &b):
		container, blocks, np, ni, ci := b.Container, b.Blocks, b.Np, b.Ni, b.Ci
		algorithm = packing.NewBCA(container, blocks, np, ni, ci, random)

	case parseGASettings(data, &g):
		container, blocks, np, mp, ni := g.Container, g.Blocks, g.Np, g.Mp, g.Ni
		var evolution packing.Evolution
		switch g.Evolution {
		case "Darwin":
			evolution = packing.DarwinEvolution{}
		case "deVries":
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

func parseGASettings(data []byte, g *GASettings) bool {
	e := json.Unmarshal(data, &g)
	if e != nil || len(g.Blocks) == 0 ||
		g.Np == 0 || g.Ni == 0 || g.Mp == 0 || g.Evolution == "" {
		return false
	} else {
		return true
	}
}

func parseBCASettings(data []byte, b *BCASettings) bool {
	e := json.Unmarshal(data, &b)
	if e != nil || len(b.Blocks) == 0 ||
		b.Ci == 0 || b.Ni == 0 || b.Np == 0 {
		return false
	} else {
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

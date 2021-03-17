package main

import (
	"3d_bin/packing"
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

func (a App) Test() bool {
	return true
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

// RunAlgorithm запускает выполнение заданного алгоритма.
func (a *App) RunAlgorithm(data map[string]interface{}) bool {
	ok := true

	defer func() {
		r := recover()
		if r != nil {
			a.logger.Errorf("%v\n", r)
			ok = false
		}
	}()

	algorithmName := data["algorithm"]
	settings := data["settings"]
	container := parseContainer(data["container"])
	blocks := parseBlocks(data["blocks"])

	a.logger.Infof("PARSED:\n%v %T\n%v\n", algorithmName, algorithmName, settings)

	var algorithm packing.SearchAlgorithm
	switch algorithmName {
	case "ais":
		np, ni, ci := parseAISSettings(settings)
		algorithm = packing.NewBCA(container, blocks, np, ni, ci)

	case "ga":
		panic("ga is not implemented yet")

	default:
		panic("wrong algorithmName specified")
	}

	if ok {
		result := packing.Evaluate(algorithm)
		a.runtime.Events.Emit("result", result)
	}

	return ok
}

//// runAndSendResults отсылает результаты (через события) по мере их получения:
////
////  result - улучшенный результат,
////  done   - конец работы алгоритма.
//func (a *App) runAndSendResults(algorithm packing.SearchAlgorithm) {
//	var (
//		run = packing.StepByStepBetter(algorithm)
//
//		result       packing.SearchResult
//		stillRunning bool
//	)
//	for {
//		result, stillRunning = run()
//		a.runtime.Events.Emit("result", result)
//		if !stillRunning {
//			break
//		}
//	}
//	a.runtime.Events.Emit("done", result.Iteration)

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

func parseAISSettings(settings interface{}) (np, ni int, ci float64) {
	s := settings.(map[string]interface{})
	np = int(s["np"].(float64))
	ni = int(s["ni"].(float64))
	ci = s["ci"].(float64)
	return
}

func parseContainer(container interface{}) packing.Container {
	c := container.(map[string]interface{})
	return packing.Container{
		Width:  uint(c["w"].(float64)),
		Height: uint(c["h"].(float64)),
		Length: uint(c["l"].(float64)),
	}
}

func parseBlocks(blocks interface{}) []packing.Block {
	blocksSlice := blocks.([]interface{})
	parsed := make([]packing.Block, 0, len(blocksSlice))
	for _, block := range blocksSlice {
		parsed = append(parsed, parseBlock(block))
	}
	return parsed
}

func parseBlock(block interface{}) packing.Block {
	size := parseUINTSlice(block.([]interface{}))
	return packing.Block{
		Width:  size[0],
		Height: size[1],
		Length: size[2],
	}
}

func parseUINTSlice(slice []interface{}) [3]uint {
	if len(slice) != 3 {
		panic(errors.New("wrong slice length"))
	}
	return [3]uint{
		uint(slice[0].(float64)),
		uint(slice[1].(float64)),
		uint(slice[2].(float64)),
	}
}

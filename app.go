package main

import (
	"3d_bin/packing"
	"context"
	"errors"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math/rand"
	"path/filepath"
	goruntime "runtime"
	"strings"
	"time"
)

type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (a App) domReady(ctx context.Context) {}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {}

// processPanicReason
func (a *App) processPanicReason(reason any) error {
	err, ok := reason.(error)
	if !ok {
		err = fmt.Errorf("unknown error: %v", reason)
	}
	wrappedErr := fmt.Errorf("recovered from: %w", err)
	runtime.LogError(a.ctx, wrappedErr.Error())
	a.notifyFailure("Произошла ошибка", wrappedErr.Error())
	return wrappedErr
}

// RunBCA инициализирует работу иммунного алгоритма для этой задачи.
func (a *App) RunBCA(task packing.Task, settings packing.BCASettings, instances int) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = a.processPanicReason(r)
		}
	}()

	algorithms := make([]packing.SearchAlgorithmWithProgress, 0, instances)
	for i := 0; i < instances; i++ {
		algorithms = append(algorithms, packing.NewBCA(task, settings))
	}

	go a.evaluate(algorithms)

	return
}

// RunGA инициализирует работу генетического алгоритма для этой задачи.
func (a *App) RunGA(task packing.Task, settings packing.GASettings, instances int) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = a.processPanicReason(r)
		}
	}()

	algorithms := make([]packing.SearchAlgorithmWithProgress, 0, instances)
	for i := 0; i < instances; i++ {
		algorithms = append(algorithms, packing.NewGA(task, settings))
	}

	go a.evaluate(algorithms)

	return
}

// evaluate отсылает результаты работы алгоритма.
func (a *App) evaluate(algorithms []packing.SearchAlgorithmWithProgress) {
	const maxEventsPerSecond = 60
	const minTimeBetweenEvents = time.Second / maxEventsPerSecond

	// время, после которого можно вызывать следующее событие с результатом
	allowedTime := time.Now()

	// получение и обработка результатов
	result := packing.MultipleSearchResult{}
	for result = range packing.EvaluateMultiple(algorithms) {
		if time.Now().After(allowedTime) {
			allowedTime = time.Now().Add(minTimeBetweenEvents)
			runtime.EventsEmit(a.ctx, "result", result)
			runtime.LogInfo(a.ctx, fmt.Sprintf("StepsDone %d = %g", result.Iteration, result.Value))
		}
	}
	runtime.EventsEmit(a.ctx, "result", result)
	runtime.EventsEmit(a.ctx, "doneSearching")
	a.notifySuccess("Поиск завершен", "")
}

// selectFileToSaveInto отображает диалоговое окно, в котором пользователь
// выбирает файл, в который он хочет сохранить.
func (a *App) selectFileToSaveInto(dialogTitle string) (string, error) {
	file, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:   dialogTitle,
		Filters: []runtime.FileFilter{{"JSON файл (*.json)", "*.json"}},
	})
	if err != nil {
		return "", err
	}

	extension := filepath.Ext(file)
	switch {
	case file == "":
		return "", errors.New("no file was selected")

	case extension == "":
		file += ".json"

	case extension != "json":
		err = fmt.Errorf("file %q has extension %q", file, extension)
		runtime.LogInfo(a.ctx, err.Error())
		file = strings.TrimSuffix(file, extension) + ".json"
		runtime.LogInfo(a.ctx, fmt.Sprintf("trying to save the data into %q", file))
	}
	runtime.LogInfo(a.ctx, fmt.Sprintf("%v was selected to save into", file))
	return file, err
}

// selectJSONFileToLoadFrom отображает диалоговое окно, в котором пользователь
// выбирает файл, из которого он хочет загрузить.
func (a *App) selectJSONFileToLoadFrom(dialogTitle string) (string, error) {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title:   dialogTitle,
		Filters: []runtime.FileFilter{{"JSON файл (*.json)", "*.json"}},
	})
	if err != nil {
		return "", fmt.Errorf("failed to select a file to load data from: %w", err)
	}
	if file == "" {
		return "", errors.New("no file was selected to load data from")
	}
	runtime.LogInfo(a.ctx, fmt.Sprintf("%q was selected to load from", file))
	return file, nil
}

// SaveTask отображает диалоговое окно, в котором пользователь выбирает файл,
// в который необходимо сохранить условия задачи.
func (a *App) SaveTask(task packing.Task) error {
	file, err := a.selectFileToSaveInto("Сохранить задачу в файл")
	if err != nil {
		a.notifyFailure("Не удалось сохранить задачу", err.Error())
		return err
	}

	err = packing.SaveTaskIntoJSONFile(file, task)
	if err != nil {
		a.notifyFailure("Не удалось сохранить задачу", err.Error())
		return err
	}
	a.notifySuccess("Задача сохранена", file)
	return nil
}

// SaveSearchResult отображает диалоговое окно, в котором пользователь выбирает файл,
// в который необходимо сохранить решение некоторой задачи.
func (a *App) SaveSearchResult(result packing.SearchResult) error {
	file, err := a.selectFileToSaveInto("Сохранить решение задачи в файл")
	if err != nil {
		a.notifyFailure("Не удалось сохранить решение", err.Error())
		return err
	}

	err = packing.SaveSearchResultIntoJSONFile(file, result)
	if err != nil {
		a.notifyFailure("Не удалось сохранить решение", err.Error())
		return err
	} else {
		a.notifySuccess("Решение сохранено", file)
	}
	return nil
}

// LoadTask отображает диалоговое окно, в котором пользователь выбирает файл,
// из которого необходимо загрузить условия задачи.
func (a *App) LoadTask() (packing.Task, error) {
	file, err := a.selectJSONFileToLoadFrom("Загрузить задачу из файла")
	if err != nil {
		a.notifyFailure("Не удалось загрузить задачу", err.Error())
		return packing.Task{}, err
	}

	task, err := packing.LoadTaskFromJSONFile(file)
	if err != nil {
		a.notifyFailure("Не удалось загрузить задачу", err.Error())
		return packing.Task{}, err
	}
	a.notifySuccess("Задача загружена", file)
	return task, nil
}

// LoadSearchResult отображает диалоговое окно, в котором пользователь выбирает файл,
// из которого необходимо решение некоторой задачи.
func (a *App) LoadSearchResult() (packing.SearchResult, error) {
	file, err := a.selectJSONFileToLoadFrom("Загрузить задачу из файла")
	if err != nil {
		return packing.SearchResult{}, err
	}

	searchResult, err := packing.LoadSearchResultFromJSONFile(file)
	if err != nil {
		a.notifyFailure("Не удалось загрузить решение", err.Error())
	} else {
		a.notifySuccess("Решение загружено", file)
	}
	return searchResult, nil
}

// Generate генерирует случайные грузы для заданного контейнера.
func (a *App) Generate(c packing.Container) ([]packing.Block, error) {
	return packing.GenerateRandomBlocks(packing.NewRandomSeeded(), c), nil
}

func (a *App) AvailableCPUs() int {
	return goruntime.NumCPU()
}

func (a *App) TSFix(_ packing.MultipleSearchResult) {}

func (a *App) notifySuccess(main, secondary string) {
	a.notify(main, secondary, true)
}

func (a *App) notifyFailure(main, secondary string) {
	a.notify(main, secondary, false)
}

func (a *App) notify(main, secondary string, ok bool) {
	runtime.EventsEmit(a.ctx, "notification", newNotification(main, secondary, ok))
}

type Notification struct {
	Key       string `json:"key"`
	Main      string `json:"main"`
	Secondary string `json:"secondary"`
	Ok        bool   `json:"ok"`
}

func newNotification(main, secondary string, ok bool) Notification {
	return Notification{
		Key:       fmt.Sprint(rand.Int()),
		Main:      main,
		Secondary: secondary,
		Ok:        ok,
	}
}

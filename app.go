package main

import (
	"3d_bin/packing"
	"context"
	"fmt"
	"github.com/pkg/errors"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"path/filepath"
	"strings"
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

func (a *App) RunBCA(task packing.Task, settings packing.BCASettings) error {
	algorithm := packing.NewBCA(task, settings)
	a.evaluate(algorithm)
	return nil
}

func (a *App) RunGA(task packing.Task, settings packing.GASettings) error {
	algorithm := packing.NewGA(task, settings)
	a.evaluate(algorithm)
	return nil
}

// evaluate полностью выполняет алгоритм и возвращает результат через
// событие "result"
func (a *App) evaluate(algorithm packing.SearchAlgorithm) {
	result := packing.Evaluate(algorithm)
	runtime.EventsEmit(a.ctx, "result", result)
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
		err = errors.Errorf("file %q has extension %q", file, extension)
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
		return "", errors.Wrap(err, "failed to select a file to load data from")
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
		return err
	}

	err = packing.SaveTaskIntoJSONFile(file, task)
	if err != nil {
		return err
	}
	return nil
}

// SaveSearchResult отображает диалоговое окно, в котором пользователь выбирает файл,
// в который необходимо сохранить решение некоторой задачи.
func (a *App) SaveSearchResult(result packing.SearchResult) error {
	file, err := a.selectFileToSaveInto("Сохранить решение задачи в файл")
	if err != nil {
		return err
	}

	err = packing.SaveSearchResultIntoJSONFile(file, result)
	if err != nil {
		return err
	}
	return nil
}

// LoadTask отображает диалоговое окно, в котором пользователь выбирает файл,
// из которого необходимо загрузить условия задачи.
func (a *App) LoadTask() (packing.Task, error) {
	file, err := a.selectJSONFileToLoadFrom("Загрузить задачу из файла")
	if err != nil {
		return packing.Task{}, err
	}

	task, err := packing.LoadTaskFromJSONFile(file)
	if err != nil {
		return packing.Task{}, err
	}
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
	return searchResult, nil
}

// Generate генерирует случайные грузы для заданного контейнера.
func (a *App) Generate(c packing.Container) ([]packing.Block, error) {
	return packing.GenerateRandomBlocks(packing.NewRandomSeeded(), c), nil
}

package main

import (
	_ "embed"
	"github.com/wailsapp/wails"
)

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {
	runWails(new(App))
}

func runWails(bindings ...interface{}) {
	config := wails.AppConfig{
		Width:  1200,
		Height: 950,
		Title:  "3d_bin by Aleksey Polyakov",
		JS:     js,
		CSS:    css,
		Colour: "#fff",
	}
	app := wails.CreateApp(&config)

	for _, binding := range bindings {
		app.Bind(binding)
	}

	err := app.Run()
	if err != nil {
		panic("failed to run gui")
	}
}



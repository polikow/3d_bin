package main

import (
	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

func main() {
	runWails(new(App))
}

func runWails(bindings ...interface{}) {
	js := mewn.String("./frontend/build/static/js/main.js")
	css := mewn.String("./frontend/build/static/css/main.css")

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



package app

import (
	"3d_bin/app/internal"
	"github.com/pkg/errors"
	"github.com/wailsapp/wails"
	"log"
)

func Run(js, css string) error {
	app := wails.CreateApp(&wails.AppConfig{
		Width:  1200,
		Height: 950,
		Title:  "3d_bin by Aleksey Polyakov",
		JS:     js,
		CSS:    css,
		Colour: "#fff",
	})
	app.Bind(new(internal.App))

	if err := app.Run(); err != nil {
		return errors.Wrap(err, "failed to run desktop app")
	}
	return nil
}

func MustRun(js, css string) {
	err := Run(js, css)
	if err != nil {
		log.Fatal(err)
	}
}

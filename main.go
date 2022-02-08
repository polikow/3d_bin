package main

import (
	"3d_bin/app"
	_ "embed"
)

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {
	app.MustRun(js, css)
}

# README

## About

This is Wails 2.0 + ReactJS Template

To create a project using this template run:

`wails init -n [Your Appname] -t https://github.com/AlienRecall/wails-react-template`

## Building 

To build this project use `wails build`.

## Live Development

To run in live development mode, run `wails dev` in the project directory. The frontend dev server will run on http://localhost:34115. Wails will watch and re-build for every backend (golang) changes. Wails will also start [cra-build-watch](https://www.npmjs.com/package/cra-build-watch), which will watch for frontend changes and repack the javascript code.

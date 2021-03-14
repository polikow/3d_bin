import Floater from "./ui/Floater";
import MenuPaper from "./ui/MenuPaper";
import {Button, Typography} from "@material-ui/core";
import React from "react";
import {useStore} from "../store";
import {AppLoad, AppSave} from "../bindings";

const fileFilter = "*.json"

export default ({open, onClose}) => {

  const [container, setContainer, blocks, setBlocks] = useStore(
    s => [s.container, s.setContainer, s.blocks, s.setBlocks])

  function handleError(error) {
    console.log(error)
  }

  const handleSuccess = (message) => () => {
    console.log(message)
  }

  function saveTask() {
    AppSave("Сохранить задачу в файл...", fileFilter, {container, blocks})
      .then(handleSuccess("saved!"))
      .catch(handleError)
  }

  function loadTask() {
    AppLoad("Загрузить задачу из файла...", fileFilter)
      .then(({container, blocks}) => {
        if (container === undefined || blocks === undefined) {
          throw new Error("wrong task file format!")
        }
        setContainer(container)
        setBlocks(blocks)
        handleSuccess("loaded")()
      })
      .catch(handleError)
  }

  const [iteration, value, solution, packed, setResult] = useStore(
    s => [s.iteration, s.value, s.solution, s.packed, s.setResult])

  function saveSolution() {
    AppSave("Сохранить решение в файл...", fileFilter,
      {iteration, value, solution, packed})
      .then(handleSuccess("saved!"))
      .catch(handleError)
  }

  function loadSolution() {
    AppLoad("Загрузить решение из файла...", fileFilter)
      .then(({iteration, value, solution, packed}) => {
        if (iteration === undefined ||
          value === undefined ||
          solution === undefined ||
          packed === undefined) {
          throw new Error("wrong solution file format")
        }
        setResult({iteration, value, solution, packed})
        handleSuccess("loaded")()
      })
      .catch(handleError)
  }

  return (
    <Floater open={open} onClose={onClose}>
      <MenuPaper title="Сохранение/Загрузка" classes={["save-load"]}>
        <Button variant="contained" color="default" onClick={saveTask}>
          Сохранить задачу в файл...
        </Button>
        <Button variant="contained" color="default" onClick={loadTask}>
          Загрузить задачу из файла...
        </Button>
        <Typography variant="body2" >
          Задача - это совокупность габаритов контейнера и габаритов грузов.
        </Typography>

        <Button variant="contained" color="default" onClick={saveSolution}>
          Сохранить решение в файл...
        </Button>
        <Button variant="contained" color="default" onClick={loadSolution}>
          Загрузить решение из файла...
        </Button>
        <Typography variant="body2" >
          Решение - это совокупность порядка упаковки, значение цф и позиций грузов.
        </Typography>
      </MenuPaper>
    </Floater>
  );
}
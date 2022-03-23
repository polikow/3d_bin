import React from "react";
import {useStore} from "../store/store";
import {Button, Typography} from "@material-ui/core";
import Tab from "./ui/Tab";

interface SaveLoadProps {
  open: boolean
  onClose: () => void
}

export default ({open, onClose}: SaveLoadProps) => {
  const saveTask     = useStore(s => s.saveTask)
  const loadTask     = useStore(s => s.loadTask)
  const saveSolution = useStore(s => s.saveSolution)
  const loadSolution = useStore(s => s.loadSolution)
  return (
    <Tab title="Сохранение/Загрузка" open={open} onClose={onClose}>
      <Button variant="contained" color="default" onClick={saveTask}>
        Сохранить задачу в файл...
      </Button>
      <Button variant="contained" color="default" onClick={loadTask}>
        Загрузить задачу из файла...
      </Button>
      <Typography variant="body2">
        Задача - это совокупность габаритов контейнера и габаритов грузов.
      </Typography>

      <Button variant="contained" color="default" onClick={saveSolution}>
        Сохранить решение в файл...
      </Button>
      <Button variant="contained" color="default" onClick={loadSolution}>
        Загрузить решение из файла...
      </Button>
      <Typography variant="body2">
        Решение - это совокупность порядка упаковки, значение цф и позиций грузов.
      </Typography>
    </Tab>
  )
}
import React from "react";
import {useStore} from "../../../store/store";
import {Button, Typography} from "@material-ui/core";
import Tab from "../Tab";

interface SaveLoadProps {
  open: boolean
  onClose: () => void
}

const alwaysTrue = () => true

export default React.memo(({open, onClose}: SaveLoadProps) => {
  const [saveTask, loadTask, saveSolution, loadSolution] = useStore(
    s => [s.saveTask, s.loadTask, s.saveSolution, s.loadSolution],
    alwaysTrue
  )
  return (
    <Tab className="save-load" title="Сохранение/Загрузка" open={open} onClose={onClose}>
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
})
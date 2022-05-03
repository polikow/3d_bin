import React from "react";
import {useStore} from "../../../store/store";
import {Button, styled, Typography} from "@mui/material";
import {compareAlwaysTrue, compareState} from "../../../store/compare";
import LeftMenu from "../LeftMenu";
import Title from "../Title";
import OuterPaper from "../OuterPaper";
import InnerPaper from "../InnerPaper";

interface SaveLoadProps {
  open: boolean
  onClose: () => void
}

const CustomInnerPaper = styled(InnerPaper)`
  max-width: 280px;

  button {
    margin: 7px 0;
  }

  p {
    margin-bottom: 25px;
  }

  p:last-child {
    margin-bottom: 7px;
  }
`

export default React.memo(({open, onClose}: SaveLoadProps) => {
  const [saveTask, loadTask, saveSolution, loadSolution] = useStore(
    s => [s.saveTask, s.loadTask, s.saveSolution, s.loadSolution],
    compareAlwaysTrue
  )
  const isSearching = useStore(s => s.isSearching, compareState)
  return (
    <LeftMenu open={open} onClose={onClose}>
      <OuterPaper elevation={3}>
        <Title>Сохранение/Загрузка</Title>
        <CustomInnerPaper elevation={0}>
          <Button disabled={isSearching}
                  variant="contained" color="inherit" onClick={saveTask}>
            Сохранить задачу в файл...
          </Button>
          <Button disabled={isSearching}
                  variant="contained" color="inherit" onClick={loadTask}>
            Загрузить задачу из файла...
          </Button>
          <Typography variant="body2">
            Задача - это совокупность габаритов контейнера и габаритов грузов.
          </Typography>

          <Button disabled={isSearching}
                  variant="contained" color="inherit" onClick={saveSolution}>
            Сохранить решение в файл...
          </Button>
          <Button disabled={isSearching}
                  variant="contained" color="inherit" onClick={loadSolution}>
            Загрузить решение из файла...
          </Button>
          <Typography variant="body2">
            Решение - это совокупность порядка упаковки, значение цф и позиций грузов.
          </Typography>
        </CustomInnerPaper>
      </OuterPaper>
    </LeftMenu>
  )
})
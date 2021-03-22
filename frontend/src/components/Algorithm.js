import React, {useEffect, useState} from "react";
import {useStore} from "../store";
import Floater from "./ui/Floater";
import MenuPaper from "./ui/MenuPaper";
import {Button, MenuItem, Select} from "@material-ui/core";
import MenuPaperHideable from "./ui/MenuPaperHideable";
import AlgorithmSettings from "./AlgorithmSettings";
import {AppEvent, AppRunAlgorithm} from "../bindings";

const algorithms = ["ais", "ga"]

export default ({open, onClose}) => {

  const [blocks, container] = useStore(s => [s.blocks, s.container])
  const [isSearching, setSearching] = useStore(s => [s.isSearching, s.setSearching])
  const setResult = useStore(s => s.setResult)

  useEffect(() => {
    AppEvent("result", (result) => {
      setResult(result)
      setSearching(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [algorithm, setAlgorithm] = useState("ais")
  const handleOnAlgorithmChange = (event) => {
    const newAlgorithm = event.target.value
    if (!algorithms.includes(newAlgorithm)) {
      throw new Error(`no such algorithm ${newAlgorithm}`)
    }
    setAlgorithm(newAlgorithm)
  }

  const [settings, setSettings] = useState(null)
  const handleSettingsChange = (newSettings) => setSettings(newSettings)


  const startAlgorithm = (algorithm, settings) => () => {
    setSearching(true)
    AppRunAlgorithm(container, blocks, settings)
      .then(() => console.log("started"))
      .catch(err => {
        console.log(`failed to start ${algorithm} with the settings:`, settings)
        console.log(`error: ${err}`)
        setSearching(false)
      })
  }

  return (
    <Floater open={open} onClose={onClose} classes={["algorithm-menu"]}>
      <MenuPaper title="Поиск упаковки">
        <Select value={algorithm} onChange={handleOnAlgorithmChange}>
          <MenuItem value={"ais"}>Искусственная иммунная сеть</MenuItem>
          <MenuItem value={"ga"}>Генетический алгоритм</MenuItem>
        </Select>

        <AlgorithmSettings algorithm={algorithm}
                           onChange={handleSettingsChange}/>

        <Button variant="contained" color="primary" id="start-button"
                disabled={isSearching}
                onClick={startAlgorithm(algorithm, settings)}>
          Запустить
        </Button>
      </MenuPaper>

      <ResultPaper/>

    </Floater>
  )
}

function ResultPaper() {
  const [iteration, value, solution] = useStore(s => [s.iteration, s.value, s.solution])
  const hidden = [iteration, value, solution].reduce(((a, b) => b === null), false)

  const iterationEl = iteration === null
    ? ""
    : <p>Итерация: {iteration}</p>

  const valueEl = value === null
    ? ""
    : <p>Значение ЦФ: {value}</p>

  const solutionEl = solution === null
    ? ""
    : <p>Порядок упаковки:<br/>{solutionToString(solution)}</p>

  return (
    <MenuPaperHideable hidden={hidden}>
      {iterationEl}
      {valueEl}
      {solutionEl}
    </MenuPaperHideable>
  )
}

export function solutionToString(solution) {
  let s = `[(${solution[0].index + 1}, ${solution[0].rotation})`
  for (let i = 1; i < solution.length; i++) {
    s += `,(${solution[i].index + 1},${solution[i].rotation})`
  }
  s += "]"
  return s
}
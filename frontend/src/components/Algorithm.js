import React, {useEffect, useState} from "react";
import {useStore} from "../store";
import Floater from "./ui/Floater";
import MenuPaper from "./ui/MenuPaper";
import {Button, MenuItem, Select} from "@material-ui/core";
import MenuPaperHideable from "./ui/MenuPaperHideable";
import AlgorithmSettings from "./AlgorithmSettings";
import {AppEvent, AppRunAlgorithm} from "../bindings";
import {rotations} from "../utils";

const algorithms = ["bca", "ga"]

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

  const [algorithm, setAlgorithm] = useState("bca")
  const handleOnAlgorithmChange = (event) => {
    const newAlgorithm = event.target.value
    if (!algorithms.includes(newAlgorithm)) {
      throw new Error(`no such algorithm ${newAlgorithm}`)
    }
    setAlgorithm(newAlgorithm)
  }

  const [settings, setSettings] = useState(null)
  const handleSettingsChange = (newSettings) => {
    // console.log("change settings to:", newSettings)
    setSettings(newSettings);
  }


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
        <Select className="selector" value={algorithm} onChange={handleOnAlgorithmChange}>
          <MenuItem value={"bca"}>Искусственная иммунная сеть</MenuItem>
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

function postfix(i, nPacked, nSolution) {
  if (i === nSolution - 1) {
    if (i >= nPacked) {
      return "]</b>"
    } else {
      return "]"
    }
  } else {
    return ""
  }
}

function ResultPaper() {
  const [iteration, value, solution, packed] = useStore(s => [s.iteration, s.value, s.solution, s.packed])
  const toggleMenuOption = useStore(s => s.toggleMenuOption)
  const hidden = iteration === null || value === null || solution === null

  if (hidden) {
    return <MenuPaperHideable hidden={hidden}/>

  } else {
    return (
      <MenuPaperHideable hidden={hidden} className="algorithm-result">
        {hidden
          ? <></>
          : <>
            <p>Поиск завершен на итерации: {iteration}</p>
            <p>Значение ЦФ: {value}</p>
            <p>Порядок упаковки:<br/>
              [
              {solution.map(({index, rotation}, i) =>
                (i <= packed.length - 1)
                  ? <span key={i} className="packed">{`(${index + 1}, ${rotations[rotation]})`}</span>
                  : <span key={i} className="not-packed">{`(${index + 1}, ${rotations[rotation]})`}</span>
              )}
              ]
            </p>
            <Button variant="contained" color="primary" id="show-packed-button"
                    onClick={toggleMenuOption("packed")}
            >
              Показать упакованные грузы
            </Button>
          </>
        }
      </MenuPaperHideable>
    )
  }
}
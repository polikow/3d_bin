import React, {useEffect, useState} from "react";
import {useStore} from "../store/store";
import {Button, MenuItem, Select, TextField} from "@material-ui/core";
import Floater from "./ui/Floater";
import MenuPaper from "./ui/MenuPaper";
import {Algorithm, AlgorithmSettings, BCASettings, Evolution, GASettings, Rotation} from "../types";
import {subscribe} from "../bindings";
import MenuPaperHideable from "./ui/MenuPaperHideable";
import {Tab} from "../store/types";
import {floatInBounds, integerInBounds} from "../utils";

interface AlgorithmProps {
  open: boolean
  onClose: () => void
}

const defaultBCASettings: BCASettings = {
  np: 10,
  ci: 2.76,
  ni: 500,
}

const defaultGASettings: GASettings = {
  np: 100,
  mp: 0.21,
  ni: 500,
  evolution: "Darwin",
}

export default ({open, onClose}: AlgorithmProps) => {
  const isSearching = useStore(s => s.isSearching)
  const startAlgorithm = useStore(s => s.startAlgorithm)
  const setFinalResult = useStore(s => s.setFinalResult)

  useEffect(() => {
    subscribe("result", setFinalResult)
  }, [])

  const [algorithm, setAlgorithm] = useState(Algorithm.BCA)
  const [settings, setSettings] = useState<AlgorithmSettings>(defaultBCASettings)

  return (
    <Floater open={open} onClose={onClose} classes={["algorithm-menu"]}>
      <MenuPaper title="Поиск упаковки">
        <Select
          className="selector"
          value={algorithm}
          onChange={event => setAlgorithm(event.target.value as Algorithm)}
        >
          <MenuItem value={Algorithm.BCA}>Искусственная иммунная сеть</MenuItem>
          <MenuItem value={Algorithm.GA}>Генетический алгоритм</MenuItem>
        </Select>

        <SettingsSelector algorithm={algorithm} onChange={setSettings}/>

        <Button
          variant="contained" color="primary" id="start-button"
          disabled={isSearching} onClick={() => startAlgorithm(settings)}
        >
          Запустить
        </Button>
      </MenuPaper>

      <ResultPaper/>

    </Floater>
  )
}

interface SettingsSelectorProps {
  algorithm: Algorithm
  onChange: (newSettings: AlgorithmSettings) => void
}

const SettingsSelector = ({algorithm, onChange}: SettingsSelectorProps) => {
  const [bcaSettings, setBCASettings] = useState(defaultBCASettings)
  const [gaSettings, setGASettings] = useState(defaultGASettings)

  useEffect(() => {
    const newSettings = (algorithm === "bca") ? bcaSettings : gaSettings;
    onChange(newSettings)
  }, [algorithm, bcaSettings, gaSettings])

  switch (algorithm) {
    case Algorithm.BCA:
      return (
        <>
          <TextField
            type="number" className="text-field"
            label="Количество антител в популяции"
            InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
            value={bcaSettings.np}
            onChange={event => {
              const np = integerInBounds(event, 1, 1, 10000)
              if (bcaSettings.np === np) return
              setBCASettings({...bcaSettings, np})
            }}
          />
          <TextField
            type="number" className="text-field"
            label="Коэффициент интенсивности мутации"
            InputProps={{inputProps: {min: 0.01, max: 100, step: 0.01}}}
            value={bcaSettings.ci}
            onChange={event => {
              const ci = floatInBounds(event, 0.01, 0.01, 1)
              if (bcaSettings.ci === ci) return
              setBCASettings({...bcaSettings, ci})
            }}
          />
          <TextField
            type="number" className="text-field"
            label="Количество итераций без улучшений"
            InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
            value={bcaSettings.ni}
            onChange={event => {
              const ni = integerInBounds(event, bcaSettings.ni, 1, 10000)
              if (bcaSettings.ni === ni) return
              setBCASettings({...bcaSettings, ni})
            }}
          />
        </>
      )
    case Algorithm.GA:
      return (
        <>
          <Select className="selector"
                  value={gaSettings.evolution}
                  onChange={(event) => {
                    const evolution = event.target.value as Evolution
                    setGASettings({...gaSettings, evolution})
                  }}
          >
            <MenuItem value="Darwin">Модель эволюции Дарвина</MenuItem>
            <MenuItem value="deVries">Модель эволюции де Фриза</MenuItem>
          </Select>
          <TextField
            type="number" className="text-field"
            label="Количество хросом в популяции"
            InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
            value={gaSettings.np}
            onChange={event => {
              const np = integerInBounds(event, 1, 1, 10000)
              if (gaSettings.np === np) return
              setGASettings({...gaSettings, np})
            }}
          />
          <TextField
            type="number" className="text-field"
            label="Вероятность мутации"
            InputProps={{inputProps: {min: 0.01, max: 1, step: 0.01}}}
            value={gaSettings.mp}
            onChange={event => {
              const mp = floatInBounds(event, 0.01, 0.01, 1)
              if (gaSettings.mp === mp) return
              setGASettings({...gaSettings, mp})
            }}
          />
          <TextField
            type="number" className="text-field"
            label="Количество итераций без улучшений"
            InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
            value={gaSettings.ni}
            onChange={event => {
              const ni = integerInBounds(event, 1, 1, 10000)
              if (gaSettings.ni === ni) return
              setGASettings({...gaSettings, ni})
            }}
          />
        </>
      )
    default:
      console.error(`wrong algorithm specified ${algorithm}`)
      return <></>
  }
}

function ResultPaper() {
  const iteration = useStore(state => state.iteration)
  const value = useStore(state => state.value)
  const solution = useStore(state => state.solution)
  const packed = useStore(state => state.packed)
  const setTab = useStore(state => state.setTab)

  const hidden = iteration === 0 || value === 0

  return hidden
    // @ts-ignore
    ? <MenuPaperHideable hidden={hidden}/>
    : (
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
                  ? <span key={i} className="packed">{`(${index + 1}, ${Rotation[rotation]})`}</span>
                  : <span key={i} className="not-packed">{`(${index + 1}, ${Rotation[rotation]})`}</span>
              )}
              ]
            </p>
            <Button
              variant="contained" color="primary" id="show-packed-button"
              onClick={() => setTab(Tab.Packed)}
            >
              Показать упакованные грузы
            </Button>
          </>
        }
      </MenuPaperHideable>
    )
}

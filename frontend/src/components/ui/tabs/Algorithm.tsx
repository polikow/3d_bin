import React, {useEffect, useState} from "react";
import {useStore} from "../../../store/store";
import {Button, MenuItem, Select, TextField} from "@material-ui/core";
import Floater from "../Floater";
import MenuPaper from "../MenuPaper";
import MenuPaperHideable from "../MenuPaperHideable";
import {Rotation, Tab} from "../../../store/types";
import {floatInBounds, integerInBounds} from "../../../utils";
import {BCASettings, GASettings} from "../../../wailsjs/go/models";

type Algorithm = "bca" | "ga"

type Evolution = "Darwin" | "deVries"

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

interface AlgorithmProps {
  open: boolean
  onClose: () => void
}

export default ({open, onClose}: AlgorithmProps) => {
  const isSearching = useStore(s => s.isSearching)
  const setFinalResult = useStore(s => s.setFinalResult)
  const [startBCA, startGA] = useStore(s => [s.startBCA, s.startGA])

  const [algorithm, setAlgorithm] = useState<Algorithm>("bca")
  const [bcaSettings, setBCASettings] = useState(defaultBCASettings)
  const [gaSettings, setGASettings] = useState(defaultGASettings)

  useEffect(() => {
    window.runtime.EventsOn("result", setFinalResult)
    // @ts-ignore TODO fix wails runtime: add EventsOff method
    return () => window.runtime.EventsOff("result")
  }, [])

  const startSearching = () => {
    switch (algorithm) {
      case "bca":
        startBCA(bcaSettings)
        break
      case "ga":
        startGA(gaSettings)
        break
    }
  }

  return (
    <Floater className="algorithm-menu" open={open} onClose={onClose}>
      <MenuPaper title="Поиск упаковки">
        <Select
          className="selector"
          value={algorithm}
          onChange={event => setAlgorithm(event.target.value as Algorithm)}
        >
          <MenuItem value={"bca"}>Искусственная иммунная сеть</MenuItem>
          <MenuItem value={"ga"}>Генетический алгоритм</MenuItem>
        </Select>
        <Settings
          algorithm={algorithm}
          bcaSettings={bcaSettings}
          gaSettings={gaSettings}
          onBCAChange={setBCASettings}
          onGAChange={setGASettings}
        />
        <Button
          variant="contained" color="primary" id="start-button"
          disabled={isSearching}
          onClick={startSearching}
        >
          Запустить
        </Button>
      </MenuPaper>

      <ResultPaper/>

    </Floater>
  )
}

interface SettingsProps {
  algorithm: Algorithm
  bcaSettings: BCASettings
  gaSettings: GASettings
  onBCAChange: (s: BCASettings) => void
  onGAChange: (s: GASettings) => void
}

function Settings({algorithm, bcaSettings, gaSettings, onBCAChange, onGAChange}: SettingsProps) {
  switch (algorithm) {
    case "bca":
      return <BCASettingsSelector settings={bcaSettings} onChange={onBCAChange}/>
    case "ga":
      return <GASettingsSelector settings={gaSettings} onChange={onGAChange}/>
    default:
      console.error(`wrong algorithm specified ${algorithm}`)
      return <></>
  }
}

interface BCASettingsSelectorProps {
  settings: BCASettings
  onChange: (s: BCASettings) => void
}

function BCASettingsSelector({settings, onChange}: BCASettingsSelectorProps) {
  return (
    <>
      <TextField
        type="number" className="text-field"
        label="Количество антител в популяции"
        InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
        value={settings.np}
        onChange={event => {
          const np = integerInBounds(event, 1, 1, 10000)
          if (settings.np === np) return
          onChange({...settings, np})
        }}
      />
      <TextField
        type="number" className="text-field"
        label="Коэффициент интенсивности мутации"
        InputProps={{inputProps: {min: 0.01, max: 100, step: 0.01}}}
        value={settings.ci}
        onChange={event => {
          const ci = floatInBounds(event, 0.01, 0.01, 1)
          if (settings.ci === ci) return
          onChange({...settings, ci})
        }}
      />
      <TextField
        type="number" className="text-field"
        label="Количество итераций без улучшений"
        InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
        value={settings.ni}
        onChange={event => {
          const ni = integerInBounds(event, settings.ni, 1, 10000)
          if (settings.ni === ni) return
          onChange({...settings, ni})
        }}
      />
    </>
  )
}

interface GASettingsSelectorProps {
  settings: GASettings
  onChange: (s: GASettings) => void
}

function GASettingsSelector({settings, onChange}: GASettingsSelectorProps) {
  return (
    <>
      <Select
        className="selector"
        value={settings.evolution}
        onChange={(event) => {
          const evolution = event.target.value as Evolution
          onChange({...settings, evolution})
        }}
      >
        <MenuItem value="Darwin">Модель эволюции Дарвина</MenuItem>
        <MenuItem value="deVries">Модель эволюции де Фриза</MenuItem>
      </Select>
      <TextField
        type="number" className="text-field"
        label="Количество хросом в популяции"
        InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
        value={settings.np}
        onChange={event => {
          const np = integerInBounds(event, 1, 1, 10000)
          if (settings.np === np) return
          onChange({...settings, np})
        }}
      />
      <TextField
        type="number" className="text-field"
        label="Вероятность мутации"
        InputProps={{inputProps: {min: 0.01, max: 1, step: 0.01}}}
        value={settings.mp}
        onChange={event => {
          const mp = floatInBounds(event, 0.01, 0.01, 1)
          if (settings.mp === mp) return
          onChange({...settings, mp})
        }}
      />
      <TextField
        type="number" className="text-field"
        label="Количество итераций без улучшений"
        InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
        value={settings.ni}
        onChange={event => {
          const ni = integerInBounds(event, 1, 1, 10000)
          if (settings.ni === ni) return
          onChange({...settings, ni})
        }}
      />
    </>
  )
}

function ResultPaper() {
  const {iteration, value, solution, packed} = useStore(s => s.searchResult)
  const setTab = useStore(s => s.setTab)

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

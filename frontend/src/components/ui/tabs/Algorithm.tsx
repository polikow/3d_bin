import React, {CSSProperties, useCallback, useEffect, useMemo, useState} from "react";
import {useStore} from "../../../store/store";
import {Button, MenuItem, Select, TextField} from "@material-ui/core";
import Floater from "../Floater";
import MenuPaper from "../MenuPaper";
import MenuPaperHideable from "../MenuPaperHideable";
import {Rotation, Tab} from "../../../store/types";
import {floatInBounds, integerInBounds} from "../../../utils";
import {BCASettings, GASettings} from "../../../wailsjs/go/models";
import classNames from "classnames";
import {compareStateSlices} from "../../../store/compare";

type Algorithm = "bca" | "ga"

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

const initialAlgorithm = "bca" as Algorithm

const gaValuesLabels = [
  ["Darwin", "Модель эволюции Дарвина"],
  ["deVries", "Модель эволюции де Фриза"],
] as Array<[string, string]>

const algorithmValuesLabels = [
  ["bca", "Искусственная иммунная сеть"],
  ["ga", "Генетический алгоритм"],
] as Array<[string, string]>

const formStyle = {
  display: "inherit",
  flexFlow: "inherit",
} as CSSProperties

export default React.memo(({open, onClose}: AlgorithmProps) => {
  const [isSearching, setFinalResult, startBCA, startGA] = useStore(
    s => [s.isSearching, s.setFinalResult, s.startBCA, s.startGA],
    compareStateSlices
  )
  const [algorithm, setAlgorithm] = useState(initialAlgorithm)

  useEffect(() => {
    window.runtime.EventsOn("result", setFinalResult)
    // @ts-ignore TODO fix wails runtime: add EventsOff method
    return () => window.runtime.EventsOff("result")
  }, [])

  const handleAlgorithmChange = useCallback(
    value => setAlgorithm(value as Algorithm),
    []
  )
  const handleStart = useCallback(
    event => {
      event.preventDefault()
      const form = event.target;
      const algorithm = form[0].value as Algorithm
      switch (algorithm) {
        case "bca":
          startBCA({
            np: parseInt(form[1].value),
            ci: parseFloat(form[2].value),
            ni: parseInt(form[3].value)
          })
          break
        case "ga":
          startGA({
            evolution: form[1].value,
            np: parseInt(form[2].value),
            mp: parseFloat(form[3].value),
            ni: parseInt(form[4].value)
          })
          break
      }
    },
    []
  )
  return (
    <Floater className="algorithm-menu" open={open} onClose={onClose}>
      <MenuPaper title="Поиск упаковки">
        <form style={formStyle} onSubmit={handleStart}>
          <SelectField
            defaultValue={initialAlgorithm}
            valuesLabels={algorithmValuesLabels}
            onChange={handleAlgorithmChange}
          />
          {algorithm === "bca" && (
            <>
              <NumericField
                label="Количество антител в популяции"
                name="np" initial={defaultBCASettings.np}
                min={1} max={10000} step={1}
              />
              <NumericField
                label="Коэффициент интенсивности мутации"
                name="ci" initial={defaultBCASettings.ci}
                min={0.01} max={100} step={0.01}
              />
              <NumericField
                label="Количество итераций без улучшений"
                name="ni" initial={defaultBCASettings.ni}
                min={1} max={2000} step={1}
              />
            </>
          )}
          {algorithm === "ga" && (
            <>
              <SelectField
                defaultValue="deVries"
                valuesLabels={gaValuesLabels}
              />
              <NumericField
                label="Количество хросом в популяции"
                name="np" initial={defaultGASettings.np}
                min={1} max={10000} step={1}
              />
              <NumericField
                label="Вероятность мутации"
                name="mp" initial={defaultGASettings.mp}
                min={0.01} max={1} step={0.01}
              />
              <NumericField
                label="Количество итераций без улучшений"
                name="ni" initial={defaultGASettings.ni}
                min={1} max={2000} step={1}
              />
            </>
          )}
          <Button
            variant="contained" color="primary" id="start-button" type="submit"
            disabled={isSearching}
          >
            Запустить
          </Button>
        </form>
      </MenuPaper>

      <ResultPaper/>

    </Floater>
  )
})

interface NumericFieldProps {
  label: string
  name: string
  initial: number
  min: number
  max: number
  step: number
}

function NumericField({label, name, initial, min, max, step}: NumericFieldProps) {
  const [value, setValue] = useState(initial)
  const inputProps = useMemo(
    () => ({inputProps: {min, max, step}}),
    [min, max, step]
  )
  const handleChange = useCallback(
    event => setValue(Number.isInteger(step)
      ? integerInBounds(event, initial, min, max)
      : floatInBounds(event, initial, min, max)),
    [initial, min, max, step]
  )
  return (
    <TextField
      className="text-field"
      type="number"
      label={label}
      name={name} value={value}
      InputProps={inputProps}
      onChange={handleChange}
    />
  )
}

interface SelectFieldProps {
  defaultValue: string
  valuesLabels: Array<[string, string]>
  onChange?: (newValue: string) => void
}

function SelectField({defaultValue, valuesLabels, onChange}: SelectFieldProps) {
  const [value, setValue] = useState(defaultValue)
  const handleChange = (event: { target: { value: any; }; }) => {
    const newValue = event.target.value;
    setValue(value)
    if (onChange === undefined) return;
    onChange(newValue)
  }
  return (
    <Select
      className="selector"
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      {valuesLabels.map((
        [value, label]) =>
        <MenuItem key={value} value={value}>{label}</MenuItem>
      )}
    </Select>
  )
}

function ResultPaper() {
  const [{iteration, value, solution, packed}, setTab] = useStore(
    s => [s.searchResult, s.setTab],
    (prev, next) => (
      // незачем проверять все остальные части объекта решения
      prev[0].iteration === next[0].iteration && prev[0].value === next[0].value
    )
  )
  const handleOpenPackedButtonClick = useCallback(() => setTab(Tab.Packed), [])
  const hidden = iteration === 0 || value === 0
  const className = classNames({"algorithm-result": !hidden})
  return (
    <MenuPaperHideable hidden={hidden} className={className}>
      {!hidden &&
        <>
          <p>Значение ЦФ: {value}</p>
          <p>Порядок упаковки:<br/>
            [
            {solution.map((
              {index, rotation}, i) => (i <= packed.length - 1)
                ? <span key={i} className="packed">{`(${index + 1}, ${Rotation[rotation]})`}</span>
                : <span key={i} className="not-packed">{`(${index + 1}, ${Rotation[rotation]})`}</span>
            )}
            ]
          </p>
          <Button
            variant="contained" color="primary" id="show-packed-button"
            onClick={handleOpenPackedButtonClick}
          >
            Показать упакованные грузы
          </Button>
        </>
      }
    </MenuPaperHideable>
  )
}

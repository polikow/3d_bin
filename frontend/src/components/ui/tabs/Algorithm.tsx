import React, {useCallback, useState} from "react";
import {useStore} from "../../../store/store";
import {Button, styled} from "@mui/material";
import Floater from "../Floater";
import {Rotation, Tab} from "../../../store/types";
import {BCASettings, GASettings} from "../../../wailsjs/go/models";
import {compareAlwaysTrue, compareState, compareStateSlices} from "../../../store/compare";
import Title from "../Title";
import OuterPaper from "../OuterPaper";
import InnerPaper from "../InnerPaper";
import NumericInput from "../NumericInput";
import SelectInput from "../SelectInput";

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

const CustomForm = styled("form")`
  display: inherit;
  flex-flow: inherit;
`

const CustomButton = styled(Button)`
  margin: 10px 0 7px 0;
`

const ResultFloater = styled(Floater)`
  position: initial;
  width: fit-content;
`

const ResultInnerPaper = styled(InnerPaper)`
  max-width: 280px;
  max-height: 376px;
  overflow: scroll;
`

export default React.memo(({open, onClose}: AlgorithmProps) => {
  const [startBCA, startGA, setTab] = useStore(
    s => [s.startBCA, s.startGA, s.setTab],
    compareAlwaysTrue
  )
  const isSearching = useStore(s => s.isSearching, compareState)
  const outputOpen = useStore(s => s.searchResult.iteration !== 0, compareState)
  const [algorithm, setAlgorithm] = useState(initialAlgorithm)

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
  const handleOpenPackedButtonClick = useCallback(() => setTab(Tab.Packed), [])
  return (
    <Floater open={open} onClose={onClose}>
      <OuterPaper elevation={3}>
        <Title>Поиск упаковки</Title>
        <InnerPaper elevation={0}>
          <CustomForm onSubmit={handleStart}>
            <SelectInput
              defaultValue={initialAlgorithm}
              valuesLabels={algorithmValuesLabels}
              onChange={handleAlgorithmChange}
            />
            {algorithm === "bca" && (
              <>
                <NumericInput
                  label="Количество антител в популяции"
                  name="np" initial={defaultBCASettings.np}
                  min={1} max={10000} step={1}
                />
                <NumericInput
                  label="Коэффициент интенсивности мутации"
                  name="ci" initial={defaultBCASettings.ci}
                  min={0.01} max={100} step={0.01}
                />
                <NumericInput
                  label="Количество итераций без улучшений"
                  name="ni" initial={defaultBCASettings.ni}
                  min={1} max={2000} step={1}
                />
              </>
            )}
            {algorithm === "ga" && (
              <>
                <SelectInput
                  defaultValue="deVries"
                  valuesLabels={gaValuesLabels}
                />
                <NumericInput
                  label="Количество хросом в популяции"
                  name="np" initial={defaultGASettings.np}
                  min={1} max={10000} step={1}
                />
                <NumericInput
                  label="Вероятность мутации"
                  name="mp" initial={defaultGASettings.mp}
                  min={0.01} max={1} step={0.01}
                />
                <NumericInput
                  label="Количество итераций без улучшений"
                  name="ni" initial={defaultGASettings.ni}
                  min={1} max={2000} step={1}
                />
              </>
            )}
            <CustomButton
              variant="contained" color="primary" type="submit"
              disabled={isSearching}
            >
              Запустить
            </CustomButton>
          </CustomForm>
        </InnerPaper>
      </OuterPaper>

      <ResultFloater open={outputOpen}>
        <OuterPaper elevation={3}>
          <ResultInnerPaper elevation={0}>
            <Iteration/>
            <Value/>
            <PackingOrder/>
            <CustomButton
              variant="contained" color="primary"
              onClick={handleOpenPackedButtonClick}
            >
              Показать упакованные грузы
            </CustomButton>
          </ResultInnerPaper>
        </OuterPaper>
      </ResultFloater>

    </Floater>
  )
})

function Iteration() {
  const [isSearching, iteration] = useStore(
    s => [s.isSearching, s.searchResult.iteration],
    compareStateSlices
  )
  return isSearching
    ? <p>Текущая итерация: {iteration}</p>
    : <p>Поиск завершен на итерации: {iteration}</p>
}

function Value() {
  const value = useStore(s => s.searchResult.value, compareState)
  return <p>Значение ЦФ: {value}</p>
}

const PackedSpan = styled("span")``

const NotPackedSpan = styled("span")`
  color: gray;
`

function PackingOrder() {
  const [solution, packed,] = useStore(s =>
      [s.searchResult.solution, s.searchResult.packed, s.searchResult.value],
    ([, , prevValue], [, , nextValue]) => prevValue === nextValue
  )
  return (
    <p>Порядок упаковки:<br/>
      [
      {solution.map((
        {index, rotation}, i) => (i <= packed.length - 1)
        ? <PackedSpan key={i}>{`(${index + 1}, ${Rotation[rotation]})`}</PackedSpan>
        : <NotPackedSpan key={i}>{`(${index + 1}, ${Rotation[rotation]})`}</NotPackedSpan>
      )}
      ]
    </p>
  )
}
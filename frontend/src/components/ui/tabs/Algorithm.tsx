import React, {useCallback, useState} from "react";
import {useStore} from "../../../store/store";
import {Button, styled} from "@mui/material";
import {Tab} from "../../../store/types";
import {packing} from "../../../wailsjs/go/models";
import {compareAlwaysTrue, compareState} from "../../../store/compare";
import Floater from "../Floater";
import Title from "../Title";
import OuterPaper from "../OuterPaper";
import InnerPaper from "../InnerPaper";
import NumericInput from "../NumericInput";
import SelectInput from "../SelectInput";
import Progress from "../Progress";
import BoldSpan from "../BoldSpan";
import PackingOrder from "../PackingOrder";
import TextTypography from "../TextTypography";

type Algorithm = "bca" | "ga"

interface AlgorithmProps {
  open: boolean
  onClose: () => void
}

const defaultBCASettings: packing.BCASettings = {
  np: 20,
  ci: 2.76,
  ni: 400,
}

const defaultGASettings: packing.GASettings = {
  np: 100,
  mp: 0.21,
  ni: 400,
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
  width: 100%;
`

const ResultInnerPaper = styled(InnerPaper)`
  max-width: 280px;
  overflow-y: auto;
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
              disabled={isSearching}
            />
            {algorithm === "bca" && (
              <>
                <NumericInput
                  label="Количество антител в популяции"
                  name="np" initial={defaultBCASettings.np}
                  min={1} max={10000} step={1}
                  disabled={isSearching}
                />
                <NumericInput
                  label="Коэффициент интенсивности мутации"
                  name="ci" initial={defaultBCASettings.ci}
                  min={0.01} max={100} step={0.01}
                  disabled={isSearching}
                />
                <NumericInput
                  label="Количество итераций без улучшений"
                  name="ni" initial={defaultBCASettings.ni}
                  min={1} max={2000} step={1}
                  disabled={isSearching}
                />
              </>
            )}
            {algorithm === "ga" && (
              <>
                <SelectInput
                  defaultValue="deVries"
                  valuesLabels={gaValuesLabels}
                  disabled={isSearching}
                />
                <NumericInput
                  label="Количество хросом в популяции"
                  name="np" initial={defaultGASettings.np}
                  min={1} max={10000} step={1}
                  disabled={isSearching}
                />
                <NumericInput
                  label="Вероятность мутации"
                  name="mp" initial={defaultGASettings.mp}
                  min={0.01} max={1} step={0.01}
                  disabled={isSearching}
                />
                <NumericInput
                  label="Количество итераций без улучшений"
                  name="ni" initial={defaultGASettings.ni}
                  min={1} max={2000} step={1}
                  disabled={isSearching}
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
          <Title>Прогресс поиска</Title>
          <ResultInnerPaper sx={{maxHeight: "104px"}} elevation={0}>
            <Progress/>
          </ResultInnerPaper>
        </OuterPaper>
      </ResultFloater>

      <ResultFloater open={outputOpen}>
        <OuterPaper elevation={3}>
          <Title>Найденное решение</Title>
          <ResultInnerPaper sx={{maxHeight: "230px"}} elevation={0}>
            <Value/>
            <PackingOrder/>
            <CustomButton
              variant="contained" color="primary"
              onClick={handleOpenPackedButtonClick}
            >
              Подробнее об упаковке...
            </CustomButton>
          </ResultInnerPaper>
        </OuterPaper>
      </ResultFloater>

    </Floater>
  )
})

function Value() {
  const value = useStore(s => s.searchResult.value, compareState)
  return (
    <TextTypography>
      Значение ЦФ: <BoldSpan>{value}</BoldSpan>
    </TextTypography>
  )
}

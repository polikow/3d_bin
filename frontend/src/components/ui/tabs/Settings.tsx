import React, {useCallback} from "react";
import {useStore} from "../../../store/store";
import {Button} from "@material-ui/core";
import Floater from "../Floater";
import MenuPaper from "../MenuPaper";
import ButtonGroup from "../ButtonGroup";
import Slider from "../Slider";
import Switch from "../Switch";
import {compareStateSlices} from "../../../store/compare";

interface SettingsProps {
  open: boolean
  onClose: () => void
}

export default React.memo(({open, onClose}: SettingsProps) => (
  <Floater open={open} onClose={onClose}>

    <MenuPaper title="Камера">
      <CameraFOVButtonGroup/>
    </MenuPaper>

    <MenuPaper title="Вид грузов">
      <OpacitySlider/>
      <ColorSwitch/>
      <EdgesSwitch/>
    </MenuPaper>

    <MenuPaper title="Вид контейнера">
      <GridSwitch/>
      <LabelSizeSlider/>
    </MenuPaper>

    <MenuPaper>
      <DebugModeSwitch/>
    </MenuPaper>

  </Floater>
))

function CameraFOVButtonGroup() {
  const [fov, setFOV] = useStore(s => [s.fov, s.setFOV], compareStateSlices)

  const handlePOVChange = useCallback(
    (event: any) => {
      const newFOV = event.target.value !== undefined
        ? event.target.value
        : event.target.parentNode.value

      if (newFOV !== undefined && fov !== parseInt(newFOV)) {
        setFOV(parseInt(newFOV))
      }
    },
    [fov]
  )

  const color = useCallback(
    (value: string | number) =>
      parseInt(value as string) === fov
        ? "primary"
        : "default",
    [fov]
  )

  return (
    <ButtonGroup
      label="Угол обзора"
      onClick={handlePOVChange}>
      <Button color={color(60)} value={60}>60</Button>
      <Button color={color(75)} value={75}>75</Button>
      <Button color={color(90)} value={90}>90</Button>
      <Button color={color(110)} value={110}>110</Button>
    </ButtonGroup>
  )
}

function OpacitySlider() {
  const [opacity, setOpacity] = useStore(
    s => [s.opacity, s.setOpacity],
    compareStateSlices
  )
  const onChange = useCallback((_, value) => setOpacity(value), [])
  return (
    <Slider
      label="Прозрачность"
      min={0} max={1} step={0.01}
      value={opacity}
      onChange={onChange}
    />
  )
}

function ColorSwitch() {
  const [isColorful, setColorful] = useStore(
    s => [s.isColorful, s.setColorful],
    compareStateSlices
  )
  const onChange = useCallback((_, value) => setColorful(value), [])
  return (
    <Switch
      label="Разные цвета"
      checked={isColorful}
      onChange={onChange}
    />
  )
}


function EdgesSwitch() {
  const [onlyEdges, setOnlyEdges] = useStore(
    s => [s.onlyEdges, s.setOnlyEdges],
    compareStateSlices
  )
  return (
    <Switch
      label="Отображать только ребра"
      checked={onlyEdges}
      onChange={event => setOnlyEdges(event.target.checked)}
    />
  )
}

function GridSwitch() {
  const [isGridVisible, setGridVisible] = useStore(
    s => [s.isGridVisible, s.setGridVisible],
    compareStateSlices
  )
  const onGridChange = useCallback(event => setGridVisible(event.target.checked), [])
  return (
    <Switch
      label="Сетка"
      checked={isGridVisible}
      onChange={onGridChange}
    />
  )
}

function LabelSizeSlider() {
  const [labelScale, setLabelScale] = useStore(
    s => [s.labelScale, s.setLabelScale],
    compareStateSlices
  )
  const onSliderChange = useCallback((_, value) => setLabelScale(value), [])
  return (
    <Slider
      label="Размер меток"
      min={1} max={30} step={1}
      value={labelScale}
      onChange={onSliderChange}
    />
  )
}

function DebugModeSwitch() {
  const [isDebugMode, setDebugMode] = useStore(
    s => [s.isDebugMode, s.setDebugMode],
    compareStateSlices
  )
  const onChange = useCallback(event => setDebugMode(event.target.checked), [])
  return (
    <Switch
      label="Режим отладки"
      color="secondary"
      checked={isDebugMode}
      onChange={onChange}
    />
  )
}
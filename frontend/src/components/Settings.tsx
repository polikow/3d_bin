import React from "react";
import {useStore} from "../store/store";
import {Button} from "@material-ui/core";
import Floater from "./ui/Floater";
import MenuPaper from "./ui/MenuPaper";
import ButtonGroup from "./ui/ButtonGroup";
import Slider from "./ui/Slider";
import Switch from "./ui/Switch";

interface SettingsProps {
  open: boolean
  onClose: () => void
}

export default ({open, onClose}: SettingsProps) => (
  <Floater open={open} onClose={onClose}>
    <CameraSettings/>
    <BlockAppearanceSettings/>
    <ContainerAppearanceSettings/>
    <DebugModeSettings/>
  </Floater>
)

function CameraSettings() {
  const [fov, setFOV] = useStore(s => [s.fov, s.setFOV])

  const color = (value: string | number) =>
    parseInt(value as string) === fov
      ? "primary"
      : "default"

  const handlePOVChange = (event: any) => {
    const newFOV = event.target.value !== undefined
      ? event.target.value
      : event.target.parentNode.value

    if (newFOV !== undefined && fov !== parseInt(newFOV)) {
      setFOV(parseInt(newFOV))
    }
  }

  return (
    <MenuPaper title="Камера">
      <ButtonGroup
        label="Угол обзора"
        onClick={handlePOVChange}>
        <Button color={color(60)} value={60}>60</Button>
        <Button color={color(75)} value={75}>75</Button>
        <Button color={color(90)} value={90}>90</Button>
        <Button color={color(110)} value={110}>110</Button>
      </ButtonGroup>
    </MenuPaper>
  )
}

function BlockAppearanceSettings() {
  return (
    <MenuPaper title="Вид грузов">
      <OpacitySlider/>
      <ColorSwitch/>
      <EdgesSwitch/>
    </MenuPaper>
  )
}

function OpacitySlider() {
  const [opacity, setOpacity] = useStore(s => [s.opacity, s.setOpacity])
  return (
    <Slider
      label="Прозрачность"
      min={0} max={1} step={0.05}
      value={opacity}
      onChange={(_, value) => setOpacity(value)}
    />
  )
}

function ColorSwitch() {
  const [isColorful, setColorful] = useStore(s => [s.isColorful, s.setColorful])
  return (
    <Switch
      label="Разные цвета"
      checked={isColorful}
      onChange={(_, value) => setColorful(value)}
    />
  )
}

function EdgesSwitch() {
  const [onlyEdges, setOnlyEdges] = useStore(s => [s.onlyEdges, s.setOnlyEdges])
  return (
    <Switch
      label="Отображать только ребра"
      checked={onlyEdges}
      onChange={event => setOnlyEdges(event.target.checked)}
    />
  )
}

function ContainerAppearanceSettings() {
  const [isGridVisible, setGridVisible] = useStore(s => [s.isGridVisible, s.setGridVisible])
  const [labelScale, setLabelScale] = useStore(s => [s.labelScale, s.setLabelScale])

  return (
    <MenuPaper title="Вид контейнера">
      <Switch
        label="Сетка"
        checked={isGridVisible}
        onChange={event => setGridVisible(event.target.checked)}
      />
      <Slider
        label="Размер меток"
        min={1} max={30} step={1}
        value={labelScale}
        onChange={(_, value) => setLabelScale(value)}
      />
    </MenuPaper>
  )
}

function DebugModeSettings() {
  const [isDebugMode, setDebugMode] = useStore(s => [s.isDebugMode, s.setDebugMode])
  return (
    <MenuPaper>
      <Switch
        label="Режим отладки"
        color="secondary"
        checked={isDebugMode}
        onChange={event => setDebugMode(event.target.checked)}
      />
    </MenuPaper>
  )
}

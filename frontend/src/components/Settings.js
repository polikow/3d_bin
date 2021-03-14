import React from "react";
import {useStore} from "../store";
import Floater from "./ui/Floater";
import MenuPaper from "./ui/MenuPaper";
import ButtonGroup from "./ui/ButtonGroup";
import {Button} from "@material-ui/core";
import Slider from "./ui/Slider";
import Switch from "./ui/Switch";
import {changeStateObj} from "../utils";

export default ({open, onClose}) => {

  const [camera, setCamera] = useStore(s => [s.camera, s.setCamera])
  const [opacity, setOpacity] = useStore(s => [s.opacity, s.setOpacity])
  const [isColorful, setIsColorful] = useStore(s => [s.isColorful, s.setIsColorful])
  const [isDebugMode, setIsDebugMode] = useStore(s => [s.isDebugMode, s.setIsDebugMode])
  const [onlyEdges, setOnlyEdges] = useStore(s => [s.onlyEdges, s.setOnlyEdges])
  const [hasGaps, setHasGaps] = useStore(s => [s.hasGaps, s.setHasGaps])
  const [targetContainer, setTargetContainer] = useStore(s => [s.targetContainer, s.setTargetContainer])

  const onCameraChange = (property) => (value) => {
    const [newCamera, changed] = changeStateObj(camera)(property)(value)
    if (changed) {
      setCamera(newCamera)
    }
  }

  const handlePOVChange = (event) => {
    const newFOV = event.target.value !== undefined
      ? event.target.value
      : event.target.parentNode.value

    if (newFOV !== undefined) {
      onCameraChange("fov")(parseInt(newFOV))
    }
  }
  const povButtonColor = (value) => {
    return parseInt(value) === camera.fov ? "primary" : "default"
  }

  const handleOpacityChange = (event, newOpacity) => setOpacity(newOpacity)
  const toggleTargetContainer = (event) => setTargetContainer(event.target.checked)

  const toggleColorful = (event, newValue) => setIsColorful(newValue)
  const toggleDebugMode = (event) => setIsDebugMode(event.target.checked)
  const toggleOnlyEdges = (event) => setOnlyEdges(event.target.checked)
  const toggleGaps = (event) => setHasGaps(event.target.checked)

  return (
    <Floater open={open} onClose={onClose}>
      <MenuPaper title="Камера">
        <ButtonGroup label="Угол обзора" onClick={handlePOVChange}>
          <Button color={povButtonColor(60)} value={60}>60</Button>
          <Button color={povButtonColor(75)} value={75}>75</Button>
          <Button color={povButtonColor(90)} value={90}>90</Button>
          <Button color={povButtonColor(110)} value={110}>110</Button>
        </ButtonGroup>
        <Switch label="Фиксировать на контейнере"
                checked={targetContainer} onChange={toggleTargetContainer}/>
      </MenuPaper>

      <MenuPaper title="Вид грузов">
        <Slider label="Прозрачность" min={0} max={1} step={0.05}
                value={opacity} onChange={handleOpacityChange}/>
        <Switch label="Разные цвета" checked={isColorful}
                onChange={toggleColorful}/>
        <Switch label="Отображать только ребра"
                checked={onlyEdges} onChange={toggleOnlyEdges}/>
        <Switch label="Отступы"
                checked={hasGaps} onChange={toggleGaps}/>
      </MenuPaper>

      <MenuPaper>
        <Switch label="Режим отладки" color="secondary"
                checked={isDebugMode} onChange={toggleDebugMode}/>
      </MenuPaper>
    </Floater>
  )
}
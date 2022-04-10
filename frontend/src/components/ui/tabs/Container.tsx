import React, {useCallback} from "react";
import {useStore} from "../../../store/store";
import {TextField} from "@material-ui/core";
import Tab from "../Tab";
import {integerInBounds} from "../../../utils";
import {max, min} from "../../../consts";
import {compareAlwaysTrue, compareState} from "../../../store/compare";

const textFieldStyle = {width: "220px"}
const textInputProps = {inputProps: {min, max}}

interface ContainerProps {
  open: boolean
  onClose: () => void
}

export default React.memo(({open, onClose}: ContainerProps) => (
  <Tab title="Контейнер" open={open} onClose={onClose}>
    <WidthTextField/>
    <HeightTextField/>
    <LengthTextField/>
  </Tab>
))

function WidthTextField() {
  const width = useStore(s => s.container.w, compareState)
  const setContainerSide = useStore(s => s.setContainerSide, compareAlwaysTrue)
  const setContainerWidth = useCallback(
    event => setContainerSide("w", integerInBounds(event, min, min, max)),
    []
  )
  return (
    <TextField
      type="number" label="Ширина" className="text-field"
      style={textFieldStyle}
      InputProps={textInputProps}
      value={width}
      onChange={setContainerWidth}
    />
  )
}

function HeightTextField() {
  const height = useStore(s => s.container.h, compareState)
  const setContainerSide = useStore(s => s.setContainerSide, compareAlwaysTrue)
  const setContainerHeight = useCallback(
    event => setContainerSide("h", integerInBounds(event, min, min, max)),
    []
  )
  return (
    <TextField
      type="number" label="Ширина" className="text-field"
      style={textFieldStyle}
      InputProps={textInputProps}
      value={height}
      onChange={setContainerHeight}
    />
  )
}

function LengthTextField() {
  const length = useStore(s => s.container.l, compareState)
  const setContainerSide = useStore(s => s.setContainerSide, compareAlwaysTrue)
  const setContainerLength = useCallback(
    event => setContainerSide("l", integerInBounds(event, min, min, max)),
    []
  )
  return (
    <TextField
      type="number" label="Длина" className="text-field"
      style={textFieldStyle}
      InputProps={textInputProps}
      value={length}
      onChange={setContainerLength}
    />
  )
}
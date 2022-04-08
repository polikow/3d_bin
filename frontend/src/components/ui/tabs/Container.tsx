import React, {useCallback} from "react";
import {useStore} from "../../../store/store";
import {TextField} from "@material-ui/core";
import Tab from "../Tab";
import {Event, integerInBounds} from "../../../utils";
import {min, max} from "../../../consts";
import {compareStateSlices} from "../../../store/compare";

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

function useContainer() {
  const [container, setContainer] = useStore(
    s => [s.container, s.setContainer],
    compareStateSlices
  )
  const setSide = useCallback(
    (side: "w" | "h" | "l") => (event: Event) => {
      const value = integerInBounds(event, min, min, max)
      if (container[side] === value) return
      setContainer({...container, [side]: value})
    },
    [container]
  )
  const setWidthFromEvent = useCallback(setSide("w"), [setSide])
  const setHeightFromEvent = useCallback(setSide("h"), [setSide])
  const setLengthFromEvent = useCallback(setSide("l"), [setSide])

  return {
    width: container.w,
    height: container.h,
    length: container.l,
    setWidthFromEvent,
    setHeightFromEvent,
    setLengthFromEvent
  }
}

function WidthTextField() {
  const {width, setWidthFromEvent} = useContainer()
  return (
    <TextField
      type="number" label="Ширина" className="text-field"
      style={textFieldStyle}
      InputProps={textInputProps}
      value={width}
      onChange={setWidthFromEvent}
    />
  )
}

function HeightTextField() {
  const {height, setHeightFromEvent} = useContainer()
  return (
    <TextField
      type="number" label="Ширина" className="text-field"
      style={textFieldStyle}
      InputProps={textInputProps}
      value={height}
      onChange={setHeightFromEvent}
    />
  )
}

function LengthTextField() {
  const {length, setLengthFromEvent} = useContainer()
  return (
    <TextField
      type="number" label="Длина" className="text-field"
      style={textFieldStyle}
      InputProps={textInputProps}
      value={length}
      onChange={setLengthFromEvent}
    />
  )
}
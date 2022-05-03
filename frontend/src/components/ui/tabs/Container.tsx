import React, {useCallback} from "react";
import {useStore} from "../../../store/store";
import {styled, TextField} from "@mui/material";
import {Event, integerInBounds} from "../../../utils";
import {max, min} from "../../../consts";
import {compareAlwaysTrue, compareState} from "../../../store/compare";
import OuterPaper from "../OuterPaper";
import InnerPaper from "../InnerPaper";
import Title from "../Title";
import LeftMenu from "../LeftMenu";

interface ContainerProps {
  open: boolean
  onClose: () => void
}

export default React.memo(({open, onClose}: ContainerProps) => (
  <LeftMenu open={open} onClose={onClose}>
    <OuterPaper elevation={3}>
      <Title>Контейнер</Title>
      <InnerPaper elevation={0}>
        <WidthTextField/>
        <HeightTextField/>
        <LengthTextField/>
      </InnerPaper>
    </OuterPaper>
  </LeftMenu>
))

const CustomTextField = styled(TextField)`
  width: 220px;
  margin: 10px 0 !important;
`

const bounds = (event: Event) => integerInBounds(event, min, min, max)

const textInputProps = {inputProps: {min, max}}

function WidthTextField() {
  const width = useStore(s => s.container.w, compareState)
  const isSearching = useStore(s => s.isSearching, compareState)
  const setContainerSide = useStore(s => s.setContainerSide, compareAlwaysTrue)
  const setWidth = useCallback(e => setContainerSide("w", bounds(e)), [])
  return (
    <CustomTextField
      variant="standard" type="number" label="Ширина"
      InputProps={textInputProps}
      value={width}
      onChange={setWidth}
      disabled={isSearching}
    />
  )
}

function HeightTextField() {
  const height = useStore(s => s.container.h, compareState)
  const isSearching = useStore(s => s.isSearching, compareState)
  const setContainerSide = useStore(s => s.setContainerSide, compareAlwaysTrue)
  const setHeight = useCallback(e => setContainerSide("h", bounds(e)), [])
  return (
    <CustomTextField
      variant="standard" type="number" label="Высота"
      InputProps={textInputProps}
      value={height}
      onChange={setHeight}
      disabled={isSearching}
    />
  )
}

function LengthTextField() {
  const length = useStore(s => s.container.l, compareState)
  const isSearching = useStore(s => s.isSearching, compareState)
  const setContainerSide = useStore(s => s.setContainerSide, compareAlwaysTrue)
  const setLength = useCallback(e => setContainerSide("l", bounds(e)), [])
  return (
    <CustomTextField
      variant="standard" type="number" label="Длина"
      InputProps={textInputProps}
      value={length}
      onChange={setLength}
      disabled={isSearching}
    />
  )
}
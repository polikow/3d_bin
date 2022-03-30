import React from "react";
import {useStore} from "../../../store/store";
import {TextField} from "@material-ui/core";
import {Event, integerInBounds} from "../../../utils";
import Tab from "../Tab";

interface ContainerProps {
  open: boolean
  onClose: () => void
}

export default ({open, onClose}: ContainerProps) => {
  const [container, setContainer] = useStore(s => [s.container, s.setContainer])

  const handleContainerChange = (side: "w" | "h" | "l") => (event: Event) => {
    const value = integerInBounds(event, 1, 1, 1000000)
    if (container[side] === value) return
    setContainer({...container, [side]: value})
  }

  return (
    <Tab
      title="Контейнер"
      open={open}
      onClose={onClose}
    >
      <TextField
        type="number" label="Ширина" className="text-field"
        style={{width: "220px"}}
        InputProps={{inputProps: {min: 1, max: 1000000}}}
        value={container.w}
        onChange={handleContainerChange('w')}
      />
      <TextField
        type="number" label="Высота" className="text-field"
        InputProps={{inputProps: {min: 1, max: 1000000}}}
        value={container.h}
        onChange={handleContainerChange('h')}
      />
      <TextField
        type="number" label="Длина" className="text-field"
        InputProps={{inputProps: {min: 1, max: 1000000}}}
        value={container.l}
        onChange={handleContainerChange('l')}
      />
    </Tab>
  )
}
import React from "react";
import {useStore} from "../store";
import MenuPaper from "./ui/MenuPaper";
import {TextField} from "@material-ui/core";
import Floater from "./ui/Floater";
import {integerFromTextField, keepInBounds} from "../utils";

export default ({open, onClose}) => {

  const [container, setContainer] = useStore(s => [s.container, s.setContainer])

  function handleWidthChange(event) {
    const value = keepInBounds(integerFromTextField(event, 1), 1, 1000000)
    if (container.w !== value)
      setContainer({...container, w: value})
  }

  function handleHeightChange(event) {
    const value = keepInBounds(integerFromTextField(event, 1), 1, 1000000)
    if (container.h !== value)
      setContainer({...container, h: value})
  }

  function handleLengthChange(event) {
    const value = keepInBounds(integerFromTextField(event, 1), 1, 1000000)
    if (container.l !== value)
      setContainer({...container, l: value})
  }

  return (
    <Floater open={open} onClose={onClose}>
      <MenuPaper title="Контейнер">
        <TextField type="number" label="Ширина" className="text-field"
                   style={{width: "220px"}}
                   InputProps={{inputProps: {min: 1, max: 1000000}}}
                   value={container.w} onChange={handleWidthChange}/>
        <TextField type="number" label="Высота" className="text-field"
                   InputProps={{inputProps: {min: 1, max: 1000000}}}
                   value={container.h} onChange={handleHeightChange}/>
        <TextField type="number" label="Длина" className="text-field"
                   InputProps={{inputProps: {min: 1, max: 1000000}}}
                   value={container.l} onChange={handleLengthChange}/>
      </MenuPaper>
    </Floater>
  )
}
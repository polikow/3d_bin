import React from "react";
import {useStore} from "../store";
import MenuPaper from "./ui/MenuPaper";
import {TextField} from "@material-ui/core";
import Floater from "./ui/Floater";
import {changeStateObj} from "../utils";

export default ({open, onClose}) => {

  const [container, setContainer] = useStore(s => [s.container, s.setContainer])
  const onContainerChange = (parameter) => (event) => {
    const value = event.target.value < 1
      ? 1
      : parseInt(event.target.value)

    const [newContainer, changed] = changeStateObj(container)(parameter)(value)
    if (changed) {
      setContainer(newContainer)
    }
  }

  return (
    <Floater open={open} onClose={onClose}>
      <MenuPaper title="Контейнер">
        <TextField type="number" label="Ширина" className={"text-field"}
                   value={container.w} onChange={onContainerChange('w')}/>
        <TextField type="number" label="Высота" className={"text-field"}
                   value={container.h} onChange={onContainerChange('h')}/>
        <TextField type="number" label="Длина" className={"text-field"}
                   value={container.l} onChange={onContainerChange('l')}/>

      </MenuPaper>
    </Floater>
  )
}
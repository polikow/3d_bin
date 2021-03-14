import React, {useEffect} from "react";
import {useStore} from "../store";
import Settings from "./Settings";
import Packed from "./Packed";
import Container from "./Container";
import Blocks from "./Blocks";
import Algorithm from "./Algorithm";
import {PlayArrow, Save} from "@material-ui/icons";
import Floater from "./ui/Floater";
import {Fab} from "@material-ui/core";
import SaveLoad from "./SaveLoad";

export default () => {
  useEffect(() => console.log("UI render"))

  const menu = useStore(s => s.menu)
  const toggleMenuOption = useStore(s => s.toggleMenuOption)

  return (
    <>
      <Settings open={menu.settings} onClose={toggleMenuOption("settings")}/>
      <Packed open={menu.packed} onClose={toggleMenuOption("packed")}/>
      <Container open={menu.container} onClose={toggleMenuOption("container")}/>
      <Blocks open={menu.blocks} onClose={toggleMenuOption("blocks")}/>
      <SaveLoad open={menu.saveLoad} onClose={toggleMenuOption("saveLoad")}/>
      <Algorithm open={menu.algorithm} onClose={toggleMenuOption("algorithm")}/>

      <Floater open position="bottom-left" flow="row">
        <Option title="Настройки" active={menu.settings}
                onClick={toggleMenuOption("settings")}/>
        <Option title="Позиции" active={menu.packed}
                onClick={toggleMenuOption("packed")}/>
        <Option title="Контейнер" active={menu.container}
                onClick={toggleMenuOption("container")}/>
        <Option title="Грузы" active={menu.blocks}
                onClick={toggleMenuOption("blocks")}/>
        <Option icon={<Save/>} active={menu.saveLoad}
                onClick={toggleMenuOption("saveLoad")}/>
        <Option icon={<PlayArrow/>} active={menu.algorithm}
                onClick={toggleMenuOption("algorithm")}/>

      </Floater>
    </>
  )
}

function Option({active, onClick, title, icon}) {
  return (
    <Fab className="fab" variant="extended"
         color={active ? "primary" : "default"}
         onClick={onClick}>
      {icon}
      {title}
    </Fab>
  )
}





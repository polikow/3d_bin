import React, {useEffect} from "react";
import {useStore} from "../store/store";
import Settings from "./Settings";
import Packed from "./Packed";
import Container from "./Container";
import Blocks from "./Blocks";
import Algorithm from "./Algorithm";
import {PlayArrow, Save} from "@material-ui/icons";
import Floater from "./ui/Floater";
import SaveLoad from "./SaveLoad";
import {Tab} from "../store/types";
import Fab from "./ui/Fab";

export default () => {
  const tab = useStore(s => s.tab)
  const setTab = useStore(s => s.setTab)

  useEffect(() => console.log("UI render"))

  const toggle = (newTab: Tab) => () => {
    if (newTab === tab) {
      setTab(Tab.Nothing)
    } else {
      setTab(newTab)
    }
  }
  const is = (t: Tab) => tab === t

  return (
    <>
      <Settings open={is(Tab.Settings)} onClose={toggle(Tab.Settings)}/>
      <Packed open={is(Tab.Packed)} onClose={toggle(Tab.Packed)}/>
      <Container open={is(Tab.Container)} onClose={toggle(Tab.Container)}/>
      <Blocks open={is(Tab.Blocks)} onClose={toggle(Tab.Blocks)}/>
      <SaveLoad open={is(Tab.SaveLoad)} onClose={toggle(Tab.SaveLoad)}/>
      <Algorithm open={is(Tab.Algorithm)} onClose={toggle(Tab.Algorithm)}/>

      <Floater open position="bottom-left" flow="row">
        <Fab title="Настройки" active={is(Tab.Settings)} onClick={toggle(Tab.Settings)}/>
        <Fab title="Контейнер" active={is(Tab.Container)} onClick={toggle(Tab.Container)}/>
        <Fab title="Грузы" active={is(Tab.Blocks)} onClick={toggle(Tab.Blocks)}/>
        <Fab icon={<Save/>} active={is(Tab.SaveLoad)} onClick={toggle(Tab.SaveLoad)}/>
        <Fab icon={<PlayArrow/>} active={is(Tab.Algorithm) || is(Tab.Packed)}
                onClick={toggle(Tab.Algorithm)}/>
      </Floater>
    </>
  )
}

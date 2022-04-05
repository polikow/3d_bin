import React, {useEffect} from "react";
import {useStore} from "../../store/store";
import Settings from "./tabs/Settings";
import Packed from "./tabs/Packed";
import Container from "./tabs/Container";
import Blocks from "./tabs/Blocks";
import Algorithm from "./tabs/Algorithm";
import {PlayArrow, Save} from "@material-ui/icons";
import Floater from "./Floater";
import SaveLoad from "./tabs/SaveLoad";
import {Tab} from "../../store/types";
import Fab from "./Fab";

export default () => {
  const [tab, setTab] = useStore(s => [s.tab, s.setTab])

  useEffect(() => console.log("UI render"))

  const toggle = (t: Tab) => () => setTab(t === tab ? Tab.Nothing : t)
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
        <Fab icon={<PlayArrow/>} active={is(Tab.Algorithm) || is(Tab.Packed)} onClick={toggle(Tab.Algorithm)}/>
      </Floater>
    </>
  )
}

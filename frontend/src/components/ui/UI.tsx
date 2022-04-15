import React, {useCallback} from "react";
import {useStore} from "../../store/store";
import Settings from "./tabs/Settings";
import Packed from "./tabs/Packed";
import Container from "./tabs/Container";
import Blocks from "./tabs/Blocks";
import Algorithm from "./tabs/Algorithm";
import {PlayArrow, Save} from "@mui/icons-material";
import Floater from "./Floater";
import SaveLoad from "./tabs/SaveLoad";
import {Tab} from "../../store/types";
import Fab from "./Fab";
import {compareStateSlices} from "../../store/compare";
import {styled} from "@mui/material";

const FabFloater = styled(Floater)`
  margin: 15px;

  & > button {
    margin-right: 12px;
  }
`

export default () => {
  const [tab, setTab] = useStore(s => [s.tab, s.setTab], compareStateSlices)

  // да, здесь можно было бы использовать одну каррированную функцию, но ее
  // значение всегда будет разным -> будут лишние рендеры компонентов
  const toggleSettings = useCallback(() => setTab(Tab.Settings), [])
  const togglePacked = useCallback(() => setTab(Tab.Packed), [])
  const toggleContainer = useCallback(() => setTab(Tab.Container), [])
  const toggleBlocks = useCallback(() => setTab(Tab.Blocks), [])
  const toggleSaveLoad = useCallback(() => setTab(Tab.SaveLoad), [])
  const toggleAlgorithm = useCallback(() => setTab(Tab.Algorithm), [])

  const is = (t: Tab) => tab === t
  return (
    <>
      <Settings open={is(Tab.Settings)} onClose={toggleSettings}/>
      <Packed open={is(Tab.Packed)} onClose={togglePacked}/>
      <Container open={is(Tab.Container)} onClose={toggleContainer}/>
      <Blocks open={is(Tab.Blocks)} onClose={toggleBlocks}/>
      <SaveLoad open={is(Tab.SaveLoad)} onClose={toggleSaveLoad}/>
      <Algorithm open={is(Tab.Algorithm)} onClose={toggleAlgorithm}/>

      <FabFloater open position="bottom-left" flow="row">
        <Fab title="Настройки" active={is(Tab.Settings)} onClick={toggleSettings}/>
        <Fab title="Контейнер" active={is(Tab.Container)} onClick={toggleContainer}/>
        <Fab title="Грузы" active={is(Tab.Blocks)} onClick={toggleBlocks}/>
        <Fab icon={<Save/>} active={is(Tab.SaveLoad)} onClick={toggleSaveLoad}/>
        <Fab icon={<PlayArrow/>} active={is(Tab.Algorithm) || is(Tab.Packed)} onClick={toggleAlgorithm}/>
      </FabFloater>
    </>
  )
}

import React, {useCallback} from "react";
import {useStore} from "../../store/store";
import Settings from "./tabs/Settings";
import Packed from "./tabs/Packed";
import Container from "./tabs/Container";
import Blocks from "./tabs/Blocks";
import Algorithm from "./tabs/Algorithm";
import {PlayArrow, Save} from "@mui/icons-material";
import SaveLoad from "./tabs/SaveLoad";
import {Tab} from "../../store/types";
import Fab from "./Fab";
import {compareStateSlices} from "../../store/compare";
import {styled} from "@mui/material";
import WebGlStats from "./WebGlStats";
import FabPacked from "./FabPacked";
import Notifications from "./Notifications";

const FabWrapper = styled("div")`
  position: fixed;
  bottom: 0;
  margin: 15px;
  display: flex;
  
  z-index: 10;
  
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

      <FabWrapper>
        <Fab title="Настройки" active={is(Tab.Settings)} onClick={toggleSettings}/>
        <Fab title="Контейнер" active={is(Tab.Container)} onClick={toggleContainer}/>
        <Fab title="Грузы" active={is(Tab.Blocks)} onClick={toggleBlocks}/>
        <Fab icon={<Save/>} active={is(Tab.SaveLoad)} onClick={toggleSaveLoad}/>
        <Fab icon={<PlayArrow/>} active={is(Tab.Algorithm)} onClick={toggleAlgorithm}/>
        <FabPacked active={is(Tab.Packed)} onClick={togglePacked}/>
      </FabWrapper>

      <Notifications/>

      <WebGlStats/>
    </>
  )
}


import React, {useEffect} from "react";
import {Canvas} from "react-three-fiber";
import DebugTools from "./canvas/Debug";
import Light from "./canvas/Light";
import Camera from "./canvas/Camera";
import Container from "./canvas/Container";
import Blocks from "./canvas/Blocks";
import {useStore} from "../store";
import Cargo from "./canvas/Cargo";

export default () => {
  useEffect(() => console.log("Canvas render"))

  return (
    <Canvas>
      <Camera/>
      <DebugTools/>
      <Light/>

      {/*Основная сцена*/}
      <MainScene/>
      {/*Сцена с грузами*/}
      <CargoScene/>

    </Canvas>
  );
}

function MainScene() {
  const isCargoScene = useStore(s => s.isCargoScene)

  return isCargoScene
    ? <></>
    : <> <Blocks/> <Container/> </>
}

function CargoScene() {
  const isCargoScene = useStore(s => s.isCargoScene)

  return isCargoScene
    ? <Cargo/>
    : <></>
}

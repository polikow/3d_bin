import React, {useEffect} from "react";
import {useStore} from "../store/store";
import {Canvas} from "@react-three/fiber";
import DebugTools from "./canvas/Debug";
import Light from "./canvas/Light";
import Camera from "./canvas/Camera";
import Container from "./canvas/Container";
import Blocks from "./canvas/Blocks";
import Cargo from "./canvas/Cargo";
import {Scene} from "../store/types";

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
  const scene = useStore(s => s.scene)

  return scene == Scene.Container
    ? <> <Blocks/> <Container/> </>
    : <></>
}

function CargoScene() {
  const scene = useStore(s => s.scene)

  return scene == Scene.Cargo
    ? <Cargo/>
    : <></>
}

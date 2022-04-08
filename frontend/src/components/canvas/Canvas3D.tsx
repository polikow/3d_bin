import React, {useEffect} from "react";
import {useStore} from "../../store/store";
import {Canvas} from "@react-three/fiber";
import DebugTools from "./Debug";
import Light from "./Light";
import Camera from "./Camera";
import Container from "./Container";
import Blocks from "./Blocks";
import Cargo from "./Cargo";
import {Scene} from "../../store/types";
import {compareState} from "../../store/compare";

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
  const scene = useStore(s => s.scene, compareState)

  return scene == Scene.Container
    ? <> <Blocks/> <Container/> </>
    : <></>
}

function CargoScene() {
  const scene = useStore(s => s.scene, compareState)

  return scene == Scene.Cargo
    ? <Cargo/>
    : <></>
}

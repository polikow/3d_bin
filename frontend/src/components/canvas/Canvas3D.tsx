import {Canvas} from "@react-three/fiber";
import DebugTools from "./Debug";
import Light from "./Light";
import Container from "./Container";
import Blocks from "./Blocks";
import Camera from "./Camera"
import Controls from "./Controls"
import SceneComponent from "./Scene";
import Cargo from "./Cargo";
import {Scene} from "../../store/types";

export default () => (
  <Canvas>
    <Camera/>
    <Controls/>
    <Light/>

    <SceneComponent scene={Scene.Container}>
      <Container/>
      <Blocks/>
    </SceneComponent>

    <SceneComponent scene={Scene.Cargo}>
      <Cargo/>
    </SceneComponent>

    <DebugTools/>

  </Canvas>
)

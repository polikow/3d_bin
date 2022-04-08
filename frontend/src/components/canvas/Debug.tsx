import React from "react";
import {useStore} from "../../store/store";
import {WebGlStats} from "./WebGlStats";
import {Vector3} from "@react-three/fiber";
import {compareState} from "../../store/compare";

const gridPosition = [0, -20, 0] as Vector3
const gridArgs = [1000, 1000]

export default () => {
  const isDebugMode = useStore(s => s.isDebugMode, compareState)

  // TODO add parent node (WebGlStats)
  return isDebugMode
    ? (
      <>
        <WebGlStats className="stats" parent={undefined}/>

        <gridHelper
          position={gridPosition}
          // @ts-ignore
          args={gridArgs}
        />
        <axesHelper/>
      </>
    )
    : <></>
}
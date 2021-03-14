import {WebGlStats} from "./WebGlStats";
import React from "react";
import {useStore} from "../../store";

export default () => {
  const isDebugMode = useStore(s=> s.isDebugMode)

  return isDebugMode &&
  <>
    <WebGlStats className="stats"/>
    {/*<gridHelper position={[0, -20, 0]} args={[1000, 1000]}/>*/}
    <axesHelper/>
    {/*<Plane color={"pink"} position={[0,-10,0]} args={[20,20]} rotation={[- Math.PI / 2,0,0 ]}/>*/}
  </>
}
import React from "react";
import {useStore} from "../../store/store";
import {WebGlStats} from "./WebGlStats";

export default () => {
  const isDebugMode = useStore((s: { isDebugMode: any; })=> s.isDebugMode)

  // TODO add parent node (WebGlStats)
  return isDebugMode &&
  <>
    <WebGlStats className="stats" parent={undefined}/>
    <gridHelper position={[0, -20, 0]} args={[1000, 1000]}/>
    <axesHelper/>
  </>
}
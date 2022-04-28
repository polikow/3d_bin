import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import Grid from "./Grid";
import * as THREE from "three"

export default () => {
  const ref = useRef<THREE.Group>(null!)
  useEffect(() => {
    useStore.subscribe(
      s => s.isDebugMode, v => ref.current.visible = v
    )
  }, [])
  return (
    <group ref={ref} visible={useStore.getState().isDebugMode}>
      <primitive object={new Grid(1000, 1000, 1, 0xaaaaaa).rotateX(Math.PI / 2)}/>
      <axesHelper/>
    </group>
  )
}
import React, {ReactNode, useEffect, useRef} from "react"
import {useStore} from "../../store/store"
import {Scene} from "../../store/types"
import * as THREE from "three"

export default ({scene, children}: { scene: Scene, children: ReactNode }) => {
  const group = useRef<THREE.Group>(null!)
  useEffect(() => {
    useStore.subscribe(s => s.scene === scene, v => group.current.visible = v)
  }, [])
  return (
    <group ref={group} visible={useStore.getState().scene === scene}>
      {children}
    </group>
  )
}
import React, {ReactNode, useEffect, useRef} from "react"
import {useStore} from "../../store/store"
import {Scene} from "../../store/types"
import * as THREE from "three"

export const SceneField = Symbol("SceneField")

export interface ISceneGroup extends THREE.Group {
  [SceneField]: Scene
}

export class SceneGroup extends THREE.Group {

  readonly [SceneField]: Scene

  constructor(scene: Scene, visible: boolean) {
    super()
    this[SceneField] = scene
    this.visible = visible
  }
}

export default ({scene, children}: { scene: Scene, children: ReactNode }) => {
  const group = useRef<SceneGroup>(null!)
  useEffect(() => {
    useStore.subscribe(s => s.scene === scene, v => {
      group.current.visible = v
    })
  }, [])
  return (
    <primitive
      ref={group}
      object={new SceneGroup(scene, useStore.getState().scene === scene)}
    >
      {children}
    </primitive>
  )
}
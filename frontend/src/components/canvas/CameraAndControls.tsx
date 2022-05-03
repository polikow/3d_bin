import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {useThree} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import * as THREE from "three"
import {PerspectiveCamera as PC} from "three"
import {SceneField, SceneGroup} from "./Scene";
import {Scene} from "../../store/types";
import {containerCameraPositionFactor, max} from "../../consts";
import {OrbitControls as OC} from "three-stdlib/controls/OrbitControls";
import {boundsAndCenter} from "../../utils";

const updateContainerScene = (camera: PC, controls: OC, group: SceneGroup) => {
  const [bounds, center] = boundsAndCenter(group)

  controls.target.copy(center)
  camera.position.copy(bounds.multiply(containerCameraPositionFactor))
}

let temp = new THREE.Vector3(1, 1, 1)
const updateCargoScene = (camera: PC, controls: OC, group: SceneGroup) => {
  const [bounds, center] = boundsAndCenter(group)

  controls.target.copy(center)

  temp.x = bounds.x * 0.5
  temp.y = bounds.y * 4 + 8
  temp.z = bounds.x * 1.5
  camera.position.copy(temp)
}

const CameraAndControls = () => {
  const get = useThree(s => s.get)

  const camera = useRef<PC>(null!)
  const controls = useRef<OC>(null!)

  useEffect(() => {

    // добавляем группы каждой сцены
    const groupByScene = new Map<Scene, SceneGroup>()
    for (let child of get().scene.children) {
      if (Object.hasOwn(child, SceneField)) {
        const group = child as SceneGroup
        groupByScene.set(group[SceneField], group)
      }
    }

    // проверяем, найдены ли все сцены
    for (const s in Scene) {
      if (isNaN(Number(s))) continue
      const scene = Number(s) as Scene
      if (!groupByScene.has(scene)) {
        console.error(`scene ${scene} is not present`)
      }
    }

    let group: SceneGroup
    const update = (scene: Scene) => {
      group = groupByScene.get(scene)!
      switch (scene) {
        case Scene.Container:
          updateContainerScene(camera.current, controls.current, group)
          break
        case Scene.Cargo:
          updateCargoScene(camera.current, controls.current, group)
          break
      }
      controls.current.update()
      camera.current.updateProjectionMatrix()
    }
    update(useStore.getState().scene)

    useStore.subscribe(
      s => s.fov,
      fov => {
        camera.current.fov = fov
        camera.current.updateProjectionMatrix()
      }
    )
    useStore.subscribe(s => s.scene, update)
    useStore.subscribe(
      s => s.container,
      _ => {
        if (useStore.getState().scene !== Scene.Container) return
        updateContainerScene(camera.current, controls.current, group)
      }
    )
    useStore.subscribe(
      s => s.blocks,
      _ => {
        if (useStore.getState().scene !== Scene.Cargo) return
        updateCargoScene(camera.current, controls.current, group)
      }
    )
  }, [])
  const {w, h, l} = useStore.getState().container // TODO fix OrbitControls
  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={camera}
        fov={useStore.getState().fov}
        far={max * 100}
      />
      <OrbitControls
        makeDefault
        ref={controls}
        target={[w / 2, h / 2, l / 2]}
      />
    </>
  )
}

export default CameraAndControls
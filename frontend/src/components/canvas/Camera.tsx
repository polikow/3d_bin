import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {PerspectiveCamera} from "@react-three/drei";
import * as THREE from "three"

const {fov, position} = useStore.getState()
const far = 1000000

const Camera = () => {
  const camera = useRef<THREE.PerspectiveCamera>(null!)
  useEffect(() => {
    useStore.subscribe(s => s.fov, fov => {
      camera.current.fov = fov
      camera.current.updateProjectionMatrix()
    })
    useStore.subscribe(s => s.position, ({x, y, z}) => camera.current.position.set(x, y, z))
  }, [])
  return (
    <PerspectiveCamera makeDefault ref={camera} fov={fov} position={position} far={far}/>
  )
}

export default Camera
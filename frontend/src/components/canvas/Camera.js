import React from "react";
import {useStore} from "../../store";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";

export default () => {
  const camera = useStore(s => s.camera)

  return (
    <>
      <PerspectiveCamera makeDefault
                         fov={camera.fov}
                         position={camera.position}/>
      <OrbitControls target={camera.target}/>
    </>
  )
};

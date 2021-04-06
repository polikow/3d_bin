import React from "react";
import {useStore} from "../../store";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";

export default () => {
  const camera = useStore(s => s.camera)

  return (
    <>
      <PerspectiveCamera makeDefault
                         fov={camera.fov}
                         position={camera.position}
                         far={1000000}
      />
      <OrbitControls target={camera.target}/>
    </>
  )
};

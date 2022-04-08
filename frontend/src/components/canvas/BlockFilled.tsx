import React from "react";
import * as THREE from "three";
import {Vector3} from "@react-three/fiber";

interface BlockFilledProps {
    position: Vector3
    color: THREE.Color
    size: Vector3
    opacity?: number
}

export default ({position, color, size, opacity}: BlockFilledProps) => (
  <mesh
    position={position}
    onClick={console.log}
  >
    <boxBufferGeometry
      attach="geometry"
      // @ts-ignore
      args={size}
    />
    <meshStandardMaterial
      attach="material"
      transparent={true}
      color={color}
      opacity={opacity}
    />
  </mesh>
)
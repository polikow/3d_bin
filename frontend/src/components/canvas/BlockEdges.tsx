import React from "react";
import * as THREE from "three";
import {Vector3} from "@react-three/fiber";

interface BlockEdgesProps {
    position: Vector3
    size: Array<number>
    color: THREE.Color
    opacity?: number
}

export default ({position, size, color, opacity}: BlockEdgesProps) => (
  <lineSegments position={position}>
    <edgesGeometry attach="geometry"
                   args={[new THREE.BoxBufferGeometry(...size)]}/>
    <lineBasicMaterial attach="material" transparent={true}
                       color={color}
                       opacity={opacity}/>
  </lineSegments>
)

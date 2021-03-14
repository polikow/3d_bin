import React from "react";
import * as THREE from "three";

export default ({position, size, color, opacity}) => (
  <lineSegments position={position}>
    <edgesGeometry attach="geometry"
                   args={[new THREE.BoxBufferGeometry(...size)]}/>
    <lineBasicMaterial attach="material" transparent={true}
                       color={color}
                       opacity={opacity}/>
  </lineSegments>
)

import React from "react";

export default({position , color, opacity, size}) => (
  <mesh onClick={() => console.log("clicked")}
        position={position}>
    <boxBufferGeometry attach="geometry" args={size}/>
    <meshStandardMaterial attach="material" transparent={true}
                          color={color}
                          opacity={opacity}/>
  </mesh>
)
import React from "react";
import {Html} from "@react-three/drei";
import {Vector3} from "@react-three/fiber";


interface LabelProps {
  text: string | number
  position: Vector3
  color?: string
  scale: number
}

const zIndexRange = [1, 0]

export default ({text, position, color = "black", scale=12}: LabelProps) => {
  return <Html
    className="ns"
    center
    style={{color}}
    // @ts-ignore
    position={position}
    prepend={false} // Project content behind the canvas
    // @ts-ignore
    scaleFactor={scale} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera.
    zIndexRange={zIndexRange}>
    {text}
  </Html>;
}

import {Html} from "@react-three/drei";
import React from "react";

export default ({text, position, color = "black", scale=12}) => (
  <Html
    className="ns"
    center
    style={{color}}
    position={position}
    prepend={false} // Project content behind the canvas
    scaleFactor={scale} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera.
    zIndexRange={[1, 0]}>
    {text}
  </Html>
)

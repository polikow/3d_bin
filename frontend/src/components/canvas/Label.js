import {Html} from "@react-three/drei";
import React from "react";

export default ({text, position, color = "black"}) => (
  <Html
    className={"ns"}
    style={{color}}
    position={position}
    prepend={false} // Project content behind the canvas
    center
    scaleFactor={12} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera.
    zIndexRange={[1, 0]}>
    {text}
  </Html>
)

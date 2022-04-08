import React from "react";
import {useStore} from "../../store/store";
import Label from "./Label";
import {Point} from "../../wailsjs/go/models"
import {compareState} from "../../store/compare";

export default ({x, y, z}: Point) => {
  const labelScale = useStore(s => s.labelScale, compareState)

  const scale = labelScale + Math.floor(labelScale * Math.max(x, y, z) * 0.2) * 1.2
  return (
    <>
      <Label text="X" color="blue" position={[x / 2, 0, -0.3]} scale={scale}/>
      <Label text="Y" color="green" position={[-0.3, y / 2, -0.3]} scale={scale}/>
      <Label text="Z" color="red" position={[-0.3, 0, z / 2]} scale={scale}/>
    </>
  );
}
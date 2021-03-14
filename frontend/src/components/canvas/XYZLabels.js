import React from "react";
import Label from "./Label";

export default () => (
  <>
    <Label text="X" color="blue" position={[0.5, 0, -0.1]}/>
    <Label text="Y" color="green" position={[-0.1, 0.5, -0.1]}/>
    <Label text="Z" color="red" position={[-0.1, 0, 0.5]}/>
  </>
)
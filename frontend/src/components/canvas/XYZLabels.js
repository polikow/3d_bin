import React from "react";
import Label from "./Label";
import {useStore} from "../../store";

export default () => {
  const labelScale = useStore(s=> s.labelScale)

  return (
    <>
      <Label text="X" color="blue" position={[0.5, 0, -0.1]} scale={labelScale*1.2}/>
      <Label text="Y" color="green" position={[-0.1, 0.5, -0.1]} scale={labelScale*1.2}/>
      <Label text="Z" color="red" position={[-0.1, 0, 0.5]} scale={labelScale*1.2}/>
    </>
  );
}
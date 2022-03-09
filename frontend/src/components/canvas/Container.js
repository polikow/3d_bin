import React from "react";
import {useStore} from "../../store";
import Block from "./Block";
import Labels from "./Labels";
import LabelsXYZ from "./LabelsXYZ";
import ContainerGrids from "./ContainerGrids";


export default () => {
  const {w, h, l} = useStore(s => s.container)
  const grid = useStore(s => s.grid)

  return (
    <>
      <Block
        onlyEdges
        color="black"
        p1={{x: 0, y: 0, z: 0}}
        p2={{x: w, y: h, z: l}}
      />
      <Labels w={w} h={h} l={l}/>
      {grid && <ContainerGrids w={w} h={h} l={l}/>}
      <LabelsXYZ x={w} y={h} z={l}/>
    </>
  );
}

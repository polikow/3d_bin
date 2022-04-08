import React from "react";
import {useStore} from "../../store/store";
import Block from "./Block";
import Labels from "./Labels";
import LabelsXYZ from "./LabelsXYZ";
import ContainerGrids from "./ContainerGrids";
import {compareStateSlices} from "../../store/compare";

const p1 = {x: 0, y: 0, z: 0}

export default () => {
  const [{w, h, l}, isGridVisible] = useStore(
    s => [s.container, s.isGridVisible],
    compareStateSlices
  )
  const p2 = {x: w, y: h, z: l}
  return (
    <>
      <Block
        onlyEdges
        color="black"
        p1={p1}
        p2={p2}
      />
      <Labels w={w} h={h} l={l}/>
      {isGridVisible &&
        <ContainerGrids w={w} h={h} l={l}/>
      }
      <LabelsXYZ x={w} y={h} z={l}/>
    </>
  );
}

import React, {useMemo} from "react";
import * as THREE from "three";
import Block from "./Block";
import Label from "./Label";
import {arrayN} from "../../utils";
import {useStore} from "../../store";

const s = -0.1

export default () => {
  const {w, h, l} = useStore(s => s.container)
  const grid = useStore(s => s.grid)

  return (
    <>
      <Block onlyEdges color="black"
             p1={{x: 0, y: 0, z: 0}} p2={{x: w, y: h, z: l}}/>
      <Labels w={w} h={h} l={l}/>
      {grid && <XYZGrids w={w} h={h} l={l}/>}
      <XYZLabels x={w} y={h} z={l}/>
    </>
  );
}

const maxLabelsPerAxis = 10

function labels(axisSize) {
  if (axisSize <= maxLabelsPerAxis) {
    return arrayN(axisSize)
  } else {
    const step = Math.floor(axisSize / maxLabelsPerAxis)
    let res = arrayN(maxLabelsPerAxis).map(value => value * step)
    if (res[maxLabelsPerAxis - 1] !== axisSize)
      res.push(axisSize)
    return res
  }
}

function Labels({w, h, l}) {
  const labelScale = useStore(s => s.labelScale)
  const scale = labelScale + Math.floor(labelScale * Math.max(w, h, l) * 0.2)

  return <> <Label text={0} position={[s, 0, s]} scale={scale}/>
    {labels(w).map(i => <Label key={i} text={i} position={[i, 0, s]} scale={scale}/>)}
    {labels(h).map(i => <Label key={i} text={i} position={[s, i, s]} scale={scale}/>)}
    {labels(l).map(i => <Label key={i} text={i} position={[s, 0, i]} scale={scale}/>)}
  </>
}

function XYZLabels({x, y, z}) {
  const labelScale = useStore(s => s.labelScale)

  const scale = labelScale + Math.floor(labelScale * Math.max(x, y, z) * 0.2) * 1.2
  return (
    <>
      <Label text="X" color="blue" position={[x / 2, 0, -0.3]} scale={scale}/>
      <Label text="Y" color="green" position={[-0.3, y / 2, -0.3]} scale={scale}/>
      <Label text="Z" color="red" position={[-0.3, 0, z / 2]} scale={scale}/>
    </>
  );
}

function XYZGrids({w, h, l}) {
  const geometry = useMemo(() => {
    const points = [];
    //xz
    for (let x = 1; x < w; x++) {
      points.push(new THREE.Vector3(x, 0, 0));
      points.push(new THREE.Vector3(x, 0, l));
    }
    for (let z = 1; z < l; z++) {
      points.push(new THREE.Vector3(0, 0, z));
      points.push(new THREE.Vector3(w, 0, z));
    }
    //xy
    for (let x = 1; x < w; x++) {
      points.push(new THREE.Vector3(x, 0, 0));
      points.push(new THREE.Vector3(x, h, 0));
    }
    for (let y = 1; y < h; y++) {
      points.push(new THREE.Vector3(0, y, 0));
      points.push(new THREE.Vector3(w, y, 0));
    }
    //zy
    for (let z = 1; z < l; z++) {
      points.push(new THREE.Vector3(0, 0, z));
      points.push(new THREE.Vector3(0, h, z));
    }
    for (let y = 1; y < h; y++) {
      points.push(new THREE.Vector3(0, y, 0));
      points.push(new THREE.Vector3(0, y, l));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [w, h, l])

  return (
    <mesh>
      <lineSegments attach="geometry" args={[geometry]}/>
    </mesh>
  )
}



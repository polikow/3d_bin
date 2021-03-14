import React, {useMemo} from "react";
import * as THREE from "three";
import Block from "./Block";
import Label from "./Label";
import XYZLabels from "./XYZLabels";
import {arrayN} from "../../utils";
import {useStore} from "../../store";

const s = -0.1

export default () => {
  const {w, h, l} = useStore(s=>s.container)

  return (
    <>
      <Block onlyEdges color="black"
             p1={{x: 0, y: 0, z: 0}} p2={{x: w, y: h, z: l}}/>
      <Labels w={w} h={h} l={l}/>
      <XYZGrids w={w} h={h} l={l}/>
      <XYZLabels/>
    </>
  );
}

function Labels({w, h, l}) {
  return <> <Label text={0} position={[s, 0, s]}/>
    {arrayN(w).map(i => <Label key={i} text={i} position={[i, 0, s]}/>)}
    {arrayN(h).map(i => <Label key={i} text={i} position={[s, i, s]}/>)}
    {arrayN(l).map(i => <Label key={i} text={i} position={[s, 0, i]}/>)}
  </>
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



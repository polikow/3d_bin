import React, {useMemo} from "react";
import * as THREE from "three";
import {Block} from "../../wailsjs/go/models"

const material = new THREE.LineBasicMaterial(  );


export default ({w, h, l}: Block) => {
  const geometry = useMemo(
    () => calculate_line_segments_points({w, h, l}),
    [w, h, l]
  )
  return <lineSegments geometry={geometry} material={material}  />
}

function calculate_line_segments_points({w, h, l}: Block) {
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
  return new THREE.BufferGeometry().setFromPoints(points)
}
import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {useFrame} from "@react-three/fiber";
import {BlockPosition} from "../../wailsjs/go/models"
import Block from "./Block";
import Grids from "./Grids";
import Label from "./Label";
import {xColor, yColor, zColor} from "../../consts";
import * as THREE from "three"

const c = useStore.getState().container;
const labelsAreVisible = useStore.getState().areLabelsVisible
const {w, h, l} = c
const bp = new BlockPosition({p1: {x: 0, y: 0, z: 0}, p2: {x: w, y: h, z: l}})

const containerBlockObj = new Block(bp, 0xffffff, true, 0, false)
const gridsObj = new Grids({w, h, l} )
const xObj = new Label('x', xColor).positionAtCenterOfX(c)
const yObj = new Label('y', yColor).positionAtCenterOfY(c)
const zObj = new Label('z', zColor).positionAtCenterOfZ(c)

export default () => {
  const containerBlock = useRef<Block>(null!)
  const grids = useRef<Grids>(null!)
  const labels = useRef<THREE.Group>(null!)
  const x = useRef<Label>(null!)
  const y = useRef<Label>(null!)
  const z = useRef<Label>(null!)
  useEffect(() => {
    useStore.subscribe(
      s => s.container,
      c => {
        containerBlock.current.setPositionAndScaleFromWHL(c)
        grids.current.setDimensions(c)
        x.current.positionAtCenterOfX(c)
        y.current.positionAtCenterOfY(c)
        z.current.positionAtCenterOfZ(c)
      }
    )
    useStore.subscribe(s => s.isGridVisible, v => grids.current.visible = v)
    useStore.subscribe(s => s.areLabelsVisible, v => labels.current.visible = v)
  }, [])
  useFrame(({camera}) => {
    x.current.followCamera(camera)
    y.current.followCamera(camera)
    z.current.followCamera(camera)
  })
  return (
    <group>
      <primitive ref={containerBlock} object={containerBlockObj}/>
      <primitive ref={grids} object={gridsObj}/>
      <group ref={labels} visible={labelsAreVisible}>
        <primitive ref={x} object={xObj}/>
        <primitive ref={y} object={yObj}/>
        <primitive ref={z} object={zObj}/>
      </group>
    </group>
  )
}

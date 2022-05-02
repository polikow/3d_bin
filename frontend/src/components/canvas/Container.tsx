import {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {useFrame} from "@react-three/fiber";
import {packing} from "../../wailsjs/go/models"
import Block from "./Block";
import Grids from "./Grids";
import Label from "./Label";
import {containerColor, labelsPerAxis, labelsYShift, tickColor, tickSize, xColor, yColor, zColor} from "../../consts";
import * as THREE from "three"

const c = useStore.getState().container;
const labelsAreVisible = useStore.getState().areLabelsVisible
const {w, h, l} = c
const bp = ({p1: {x: 0, y: 0, z: 0}, p2: {x: w, y: h, z: l}}) as packing.BlockPosition

const containerBlockObj = new Block(bp, containerColor, true, 0, true)
const gridsObj = new Grids({w, h, l} )
const xObj = new Label('x', xColor).positionAtCenterOfX(c)
const yObj = new Label('y', yColor).positionAtCenterOfY(c)
const zObj = new Label('z', zColor).positionAtCenterOfZ(c)

const axesTickLabelsObjs = Array(labelsPerAxis * 3 + 1).fill(0).map(
  () => new Label('', tickColor, tickSize)
)
const tick = (j: number, axisLength: number, ticksNeeded: number) => (
  Math.ceil((j + 1) * (axisLength / ticksNeeded))
)
const updateAxesTickLabels = ({w, h, l}: { w: number, h: number, l: number }) => {
  const xNeeded = Math.min(w, labelsPerAxis)
  const yNeeded = Math.min(h, labelsPerAxis)
  const zNeeded = Math.min(l, labelsPerAxis)
  let i
  let j // число обработанных меток на конкретной оси
  for (j = 0, i = 0; i < labelsPerAxis; i++, j++) { // x
    if (j < xNeeded) {
      const t = tick(j, w, xNeeded)
      axesTickLabelsObjs[i].content = t
      axesTickLabelsObjs[i].positionAtXOf(t, c)
    } else {
      axesTickLabelsObjs[i].content = ''
    }
  }
  for (j = 0, i = labelsPerAxis; i < 2 * labelsPerAxis; i++, j++) { // y
    if (j < yNeeded) {
      const t = tick(j, h, yNeeded)
      axesTickLabelsObjs[i].content = t
      axesTickLabelsObjs[i].positionAtYOf(t, c)
    } else {
      axesTickLabelsObjs[i].content = ''
    }
  }
  for (j = 0, i = 2 * labelsPerAxis; i < 3 * labelsPerAxis; i++, j++) { // z
    if (j < zNeeded) {
      const t = tick(j, l, zNeeded)
      axesTickLabelsObjs[i].content = t
      axesTickLabelsObjs[i].positionAtZOf(t, c)
    } else {
      axesTickLabelsObjs[i].content = ''
    }
  }
  axesTickLabelsObjs[i].content = 0
  axesTickLabelsObjs[i].positionAtCornerOf(c)
}
updateAxesTickLabels(c)

export default () => {
  const containerBlock = useRef<Block>(null!)
  const grids = useRef<Grids>(null!)
  const labels = useRef<THREE.Group>(null!)
  const x = useRef<Label>(null!)
  const y = useRef<Label>(null!)
  const z = useRef<Label>(null!)
  useEffect(() => {
    labels.current.translateY(labelsYShift)
    useStore.subscribe(
      s => s.container,
      c => {
        containerBlock.current.setPositionAndScaleFromWHL(c)
        grids.current.setDimensions(c)
        x.current.positionAtCenterOfX(c)
        y.current.positionAtCenterOfY(c)
        z.current.positionAtCenterOfZ(c)
        updateAxesTickLabels(c)
      }
    )
    useStore.subscribe(s => s.isGridVisible, v => grids.current.visible = v)
    useStore.subscribe(s => s.areLabelsVisible, v => labels.current.visible = v)
  }, [])
  useFrame(({camera}) => {
    x.current.followCamera(camera)
    y.current.followCamera(camera)
    z.current.followCamera(camera)
    for (const label of axesTickLabelsObjs) {
      if (label.content !== '') {
        label.followCamera(camera)
      }
    }
  })
  return (
    <group>
      <primitive ref={containerBlock} object={containerBlockObj}/>
      <primitive ref={grids} object={gridsObj}/>
      <group ref={labels} visible={labelsAreVisible}>
        <primitive ref={x} object={xObj}/>
        <primitive ref={y} object={yObj}/>
        <primitive ref={z} object={zObj}/>
        {/*// @ts-ignore*/}
        {axesTickLabelsObjs.map(obj => <primitive key={obj.uuid} object={obj}/>)}
      </group>
    </group>
  )
}

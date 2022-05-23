import React, {useEffect} from "react";
import {useStore} from "../../store/store";
import BlockGroup from "./BlockGroup";
import {packing} from "../../../wailsjs/go/models";
import {blocksPerRow, cargoLabelColor, gap} from "../../consts";
import Label from "./Label";
import {Group, Object3D} from "three";
import {boundsAndCenter} from "../../utils";

const cargo: packing.BlockPosition[] = []
const labels: Label[] = []

function updateCargo(blocks: packing.Block[]) {
  // поиск места для одного груза
  let xSpace = 0
  let ySpace = 0
  let zSpace = 0
  for (const {w, h, l} of blocks) {
    if (w > xSpace) xSpace = w
    if (h > ySpace) ySpace = h
    if (l > zSpace) zSpace = l
  }

  // обновление числа грузов
  cargo.length = blocks.length

  // обновление позиций грузов
  for (let i = 0; i < blocks.length; i++) {
    const {w, h, l} = blocks[i]
    const row = Math.floor(i / blocksPerRow)
    const col = i % blocksPerRow
    const xShift = col * (xSpace + gap)
    const zShift = row * (zSpace + gap)
    const xSpaceShift = (xSpace - w) / 2
    const zSpaceShift = (zSpace - l) / 2
    if (cargo[i] === undefined) {
      cargo[i] = {
        p1: {
          x: xSpaceShift + xShift,
          y: 0,
          z: zSpaceShift + zShift,
        },
        p2: {
          x: w + xSpaceShift + xShift,
          y: h,
          z: l + zSpaceShift + zShift
        }
      } as packing.BlockPosition
    } else {
      cargo[i].p1.x = xSpaceShift + xShift
      cargo[i].p1.y = 0
      cargo[i].p1.z = zSpaceShift + zShift
      cargo[i].p2.x = w + xSpaceShift + xShift
      cargo[i].p2.y = h
      cargo[i].p2.z = l + zSpaceShift + zShift
    }
  }
}

function updateLabels(group: BlockGroup) {

  // обновление числа меток
  while (labels.length > group.children.length) {
    (labels.pop() as unknown as Object3D).removeFromParent()
  }

  for (let i = 0; i < cargo.length; i++) {
    if (labels[i] === undefined) {
      labels[i] = new Label(i + 1, cargoLabelColor, 1)
      labelsGroup.add(labels[i] as unknown as Object3D)
    }

    // обновление позиции
    const block = group.children[i]
    const [bounds, center] = boundsAndCenter(block)
    center.z = bounds.z / 2 + block.position.z + 0.1;
    (labels[i] as unknown as Object3D).position.copy(center);

    // обновление размера
    const d = Math.min(bounds.x, bounds.y);
    (labels[i] as unknown as Object3D).scale.set(d, d, d)
  }
}

updateCargo(useStore.getState().blocks)

const cargoGroup = BlockGroup.createFrom(cargo)
const labelsGroup = new Group()

updateLabels(cargoGroup)

export default () => {
  useEffect(() => {
    useStore.subscribe(s => s.blocks, blocks => {
      updateCargo(blocks)
      cargoGroup.setPositions(cargo)
      updateLabels(cargoGroup)
    })
    useStore.subscribe(s => s.transparency, v => cargoGroup.setTransparency(v))
    useStore.subscribe(s => s.isColorful, v => cargoGroup.setIsColorful(v))
    useStore.subscribe(s => s.onlyEdges, v => cargoGroup.setOnlyEdges(v))
  }, [])
  return (
    <group>
      <primitive object={cargoGroup}/>
      <primitive object={labelsGroup}/>
    </group>
  )
}
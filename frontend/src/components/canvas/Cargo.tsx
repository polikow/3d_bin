import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import BlockGroup from "./BlockGroup";
import {Block, BlockPosition} from "../../wailsjs/go/models";
import {blocksPerRow, gap} from "../../consts";


// положение грузов в режиме их отображения
const cargo: BlockPosition[] = []

const updatedCargo = (blocks: Block[]) => {
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
      } as BlockPosition
    } else {
      cargo[i].p1.x = xSpaceShift + xShift
      cargo[i].p1.y = 0
      cargo[i].p1.z = zSpaceShift + zShift
      cargo[i].p2.x = w + xSpaceShift + xShift
      cargo[i].p2.y = h
      cargo[i].p2.z = l + zSpaceShift + zShift
    }
  }
  return cargo
}

export default () => {
  const ref = useRef<BlockGroup>(null!)
  useEffect(() => {
    useStore.subscribe(s => s.blocks, b => ref.current.setPositions(updatedCargo(b)))
    useStore.subscribe(s => s.transparency, v => ref.current.setTransparency(v))
    useStore.subscribe(s => s.isColorful, v => ref.current.setIsColorful(v))
    useStore.subscribe(s => s.onlyEdges, v => ref.current.setOnlyEdges(v))
  }, [])
  return <primitive
    ref={ref}
    object={BlockGroup.createFrom(updatedCargo(useStore.getState().blocks))}
  />
}
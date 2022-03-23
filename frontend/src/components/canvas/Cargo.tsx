import React, {useEffect} from "react";
import {useStore} from "../../store/store";
import BlockComponent from "./Block";
import Label from "./Label";
import {Block, BlockPosition} from "../../types";
import * as UTILS from "../../store/utils";

const colors =
  ["violet", "indigo", "blue", "green", "yellow", "orange", "red"].reverse()

const blocksPerRow = 10
const gap = 2

export default function () {
  const [blocks, opacity, isColorful, onlyEdges, setPositionAndTarget] = useStore(
      s => [s.blocks, s.opacity, s.isColorful, s.onlyEdges, s.setPositionAndTarget])

  useEffect(() => console.log("cargo ui render"))

  const space = spaceForOneBlock(blocks)
  const cargo = findBlocksPositions(blocks)
  const bb = boundingBlock(blocks, space)

  useEffect(() => {
    setPositionAndTarget(UTILS.blockPosition(bb), UTILS.blockCenter(bb))
  }, [bb.w, bb.h, bb.l]) // eslint-disable-line react-hooks/exhaustive-deps

  const scale = 30 + Math.floor(30 * space[1] * 0.34)
  return (
    <>
      {
        cargo.map(({p1, p2}, i) => (
            <React.Fragment key={i}>
              <Label
                text={i + 1}
                position={[p2.x - (p2.x - p1.x) / 2, 0, p1.z - gap / 2]}
                scale={scale}/>
              <BlockComponent
                p1={p1} p2={p2}
                gap={onlyEdges}
                color={isColorful ? colors[i % colors.length] : "grey"}
                opacity={1 - opacity}
                onlyEdges={onlyEdges}/>
            </React.Fragment>
          )
        )
      }
    </>
  )
}

function spaceForOneBlock(blocks: Array<Block>): [number, number, number] {
  let xSpace = 0
  let ySpace = 0
  let zSpace = 0
  for (const {w, h, l} of blocks) {
    if (w > xSpace) xSpace = w
    if (h > ySpace) ySpace = h
    if (l > zSpace) zSpace = l
  }
  return [xSpace, ySpace, zSpace]
}

function findBlocksPositions(blocks: Array<Block>) {
  const [xSpace, , zSpace] = spaceForOneBlock(blocks)

  return blocks.map((block, i) => {
    const row = Math.floor(i / blocksPerRow)
    const col = i % blocksPerRow
    const xShift = col * (xSpace + gap)
    const zShift = row * (zSpace + gap)
    return blockPosition(block, xSpace, zSpace, xShift, zShift)
  })
}

function blockPosition({w, h, l}: Block, xSpace: number, zSpace: number, xShift: number, zShift: number) {
  const xSpaceShift = (xSpace - w) / 2
  const zSpaceShift = (zSpace - l) / 2
  return {
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
}

function boundingBlock(blocks: Array<Block>, space: number[]): Block {
  let [xSpace, ySpace, zSpace] = space

  //всего необходимо строк
  let rows = Math.ceil(blocks.length / blocksPerRow)
  let gapsBetweenCols = blocksPerRow - 1
  let gapsBetweenRows = rows - 1

  let x = xSpace * blocksPerRow + gapsBetweenCols * gap
  let y = ySpace
  let z = zSpace * rows + gapsBetweenRows * gap

  if (rows === 1)
    x = Math.floor(x / (blocksPerRow / blocks.length))

  return {w: x, h: y, l: z,}
}


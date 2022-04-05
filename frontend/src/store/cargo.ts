import {Block, BlockPosition} from "../wailsjs/go/models";
import {blocksPerRow, gap} from "../consts";
import {CargoSceneState} from "./types";

export type Space = [number,number,number]

export function cargoAndSpace(blocks: Array<Block>): CargoSceneState {
  const space = spaceForOneBlock(blocks)
  const cargo = cargoPositions(blocks, space)
  return {cargo, space}
}

export function cargoPositions(blocks: Array<Block>, space: Space): Array<BlockPosition> {
  return blocks.map((block, i) => blockPositionForBlockAtIndex(block, i, space))
}

export function blockPositionForBlockAtIndex(block: Block, i: number, space: Space) {
  const [xSpace, , zSpace] = space

  const row = Math.floor(i / blocksPerRow)
  const col = i % blocksPerRow
  const xShift = col * (xSpace + gap)
  const zShift = row * (zSpace + gap)
  return blockPosition(block, xSpace, zSpace, xShift, zShift)
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

export function spaceForOneBlock(blocks: Array<Block>): Space {
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

export function doesBlockFitInside(block: Block, space: Space) {
  return block.w > space[0] || block.h > space[1] || block.l > space[2]
}

export function spaceNeedsToBeShrunk(blocks: Array<Block>, space: Space) {
  const newSpace = spaceForOneBlock(blocks)
  return newSpace !== space
}

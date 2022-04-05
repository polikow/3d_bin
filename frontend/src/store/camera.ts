import {Block, Container} from "../wailsjs/go/models";
import {Vector3} from "@react-three/fiber";
import {blocksPerRow, gap} from "../consts";
import {Space} from "./cargo";

export type CameraSettings = {
  position: Vector3
  target: Vector3
}

export function containerCamera(c: Container): CameraSettings {
  return {
    position: cameraPositionForContainer(c),
    target: blockCenter(c)
  }
}

export function cargoCamera(blocks: Array<Block>, space: Space): CameraSettings {
  const bounds = boundingBlock(blocks, space)
  return {
    position: positionForCargo(bounds),
    target: blockCenter(bounds)
  }
}

function cameraPositionForContainer(b: Container): Vector3 {
  const yShift = 0.8
  const zShift = 0.8
  return [b.w * 2, b.h * 2 * yShift, b.l * 2 * zShift]
}

function blockCenter(b: Block): Vector3 {
  return [b.w / 2, b.h / 2, b.l / 2]
}

function positionForCargo({w, h, l}: Block): Vector3 {
  return [w / 2, h * 10, l / 2]
}

function boundingBlock(blocks: Array<Block>, space: Space): Block {
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
import {Block} from "../types";
import {Vector3} from "@react-three/fiber";

const yShift = 0.8
const zShift = 0.8

export function blockPosition(b: Block): Vector3 {
  return [b.w * 2, b.h * 2 * yShift, b.l * 2 * zShift]
}

export function blockCenter(b: Block): Vector3 {
  return [b.w / 2, b.h / 2, b.l / 2]
}

export function blocksOverviewPosition(b: Block): Vector3 {
  return [b.w / 2, b.h * 15, b.l / 2 + b.l]
}
import {Vector3} from "three";

export const blocksPerRow = 10
export const gap = 2
export const cargoLabelColor = 0x000000

export const colors =
  ["violet", "indigo", "blue", "green", "yellow", "orange", "red"].reverse()

export const defaultColor = "grey"

export const containerColor = 0x111111

// метки на осях
export const xColor = 0xfe590a
export const yColor = 0x17cd00
export const zColor = 0x191ee1
export const tickColor = 0x000000
export const tickSize = 0.5
export const labelsYShift = 0.024

export const containerCameraPositionFactor =
  new Vector3(2.2, 1.9, 1.8).multiplyScalar(0.8)

// количество строк в таблицах
export const rowsPerPage = 10

// минимальный/максимальный размер каждой стороны контейнера
export const min = 1
export const max = 1000000
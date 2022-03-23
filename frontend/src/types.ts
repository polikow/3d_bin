export interface Block {
  w: number
  h: number
  l: number
}

export type Container = Block

export interface Point {
  x: number
  y: number
  z: number
}

export interface BlockPosition {
  p1: Point
  p2: Point
}

export enum Rotation {
  XYZ,
  ZYX,
  XZY,
  YZX,
  ZXY,
  YXZ,
}

export type AlgorithmSettings = BCASettings | GASettings

export enum Algorithm {
  BCA = "bca",
  GA = "ga",
}

export interface BCASettings {
  np: number // int
  ni: number // int
  ci: number // float
}

export interface GASettings {
  np: number // int
  mp: number // float
  ni: number // int
  evolution: Evolution
}

export type Evolution = "Darwin" | "deVries"

export interface BlockPosition {
  p1: Point
  p2: Point
}

export type IndexRotation = {
  index: number
  rotation: Rotation
}

export type Solution = Array<IndexRotation>

export interface SearchResult {
  iteration: number
  value: number
  solution: Solution
  packed: Array<BlockPosition>
}
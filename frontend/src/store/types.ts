import {
  BCASettings,
  Block,
  Container,
  GASettings,
  MultipleSearchResult,
} from "../wailsjs/go/models"

export type Store =
  CanvasState & CanvasActions &
  UIState & UIActions &
  TaskState & TaskActions

export type CanvasState = {
  scene: Scene

  fov: number

  transparency: number
  isColorful: boolean
  onlyEdges: boolean

  isGridVisible: boolean
  areLabelsVisible: boolean

  cpus: number

  isDebugMode: boolean
}

export type CanvasActions = {
  setFOV: (fov: number) => void

  setTransparency: (transparency: number) => void
  setColorful: (isColorful: boolean) => void
  setOnlyEdges: (onlyEdges: boolean) => void

  setGridVisible: (isGridVisible: boolean) => void
  setLabelsVisible: (areLabelsVisible: boolean) => void

  setCPUs: (cpus: number) => void

  setDebugMode: (isDebugMode: boolean) => void
}

export type UIState = {
  tab: Tab
}

export type UIActions = {
  setTab: (tab: Tab) => void
}

export type TaskState = {
  container: Container
  blocks: Array<Block>

  isSearching: boolean
  searchResult: MultipleSearchResult
}

export type TaskActions = {
  setContainerSide: (side: "w" | "h" | "l", value: number) => void

  replaceBlocks: (blocks: Array<Block>) => void
  addNewBlock: (block: Block) => void
  removeBlockByIndex: (index: number) => void
  changeBlockByIndex: (index: number, block: Block) => void
  generateRandomBlocks: () => void

  saveTask: () => void
  loadTask: () => void

  startBCA: (settings: BCASettings) => void
  startGA: (settings: GASettings) => void

  searchStarted: () => void
  searchFailedToStart: (reason: any) => void

  setSearchResult: (searchResult: MultipleSearchResult) => void

  saveSolution: () => void
  loadSolution: () => void
}
export enum Tab {
  Nothing,
  Settings,
  Packed,
  Container,
  Blocks,
  SaveLoad,
  Algorithm,
}

export enum Scene {
  Cargo,
  Container,
}

export enum Rotation {
  XYZ,
  ZYX,
  XZY,
  YZX,
  ZXY,
  YXZ,
}
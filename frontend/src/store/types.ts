import {Vector3} from "three"
import {
  BCASettings,
  Block,
  BlockPosition,
  Container,
  GASettings,
  MultipleSearchResult,
} from "../wailsjs/go/models"

export type Store =
  CameraState & CameraActions &
  SettingsState & SettingsActions &
  SearchState & SearchActions &
  UIState & UIActions &
  TaskState & TaskActions &
  SceneState & SceneActions &
  CargoSceneState

export type CameraState = {
  fov: number
  position: Vector3
  target: Vector3
}

export type CameraActions = {
  setFOV: (fov: number) => void
  setPositionAndTarget: (position: Vector3, target: Vector3) => void
}

export type SettingsState = {
  transparency: number
  areLabelsVisible: boolean

  isColorful: boolean
  isDebugMode: boolean
  onlyEdges: boolean
  targetContainer: boolean
  isGridVisible: boolean

  cpus: number
}

export type SettingsActions = {
  setTransparency: (transparency: number) => void
  setLabelsVisible: (areLabelsVisible: boolean) => void

  setColorful: (isColorful: boolean) => void
  setDebugMode: (isDebugMode: boolean) => void
  setOnlyEdges: (onlyEdges: boolean) => void
  setGridVisible: (isGridVisible: boolean) => void

  setCPUs: (cpus: number) => void
}

export type SearchState = {
  isSearching: boolean
  searchResult: MultipleSearchResult
}

export type SearchActions = {
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

export type UIState = {
  tab: Tab
}

export type UIActions = {
  setTab: (tab: Tab) => void
}

export type ContainerState = {
  container: Container
}

export type ContainerActions = {
  setContainerSide: (side: "w" | "h" | "l", value: number) => void
}

export type BlocksState = {
  blocks: Array<Block>
}

export type BlocksActions = {
  replaceBlocks: (blocks: Array<Block>) => void
  addNewBlock: (block: Block) => void
  removeBlockByIndex: (index: number) => void
  changeBlockByIndex: (index: number, block: Block) => void
  generateRandomBlocks: () => void
}

export type TaskState = ContainerState & BlocksState
export type TaskActions = ContainerActions & BlocksActions & {
  saveTask: () => void
  loadTask: () => void
}

export enum Scene {
  Cargo,
  Container,
}

export type SceneState = {
  scene: Scene
}

export type SceneActions = {
  // setScene: (scene: Scene) => void
}

export type CargoSceneState = {
  cargo: Array<BlockPosition> // положение грузов в режиме их отображения
  space: [number, number, number] // место, необходимое для одного груза
}

export enum Rotation {
  XYZ,
  ZYX,
  XZY,
  YZX,
  ZXY,
  YXZ,
}
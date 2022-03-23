import {Vector3} from "@react-three/fiber";
import {AlgorithmSettings, Block, Container, SearchResult} from "../types";

export type Store =
  CameraState & CameraActions &
  SettingsState & SettingsActions &
  SearchState & SearchActions &
  UIState & UIActions &
  TaskState & TaskActions &
  SceneState & SceneActions

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
  opacity: number
  labelScale: number

  isColorful: boolean
  isDebugMode: boolean
  onlyEdges: boolean
  targetContainer: boolean
  isGridVisible: boolean
}

export type SettingsActions = {
  setOpacity: (opacity: number) => void
  setLabelScale: (labelScale: number) => void

  setColorful: (isColorful: boolean) => void
  setDebugMode: (isDebugMode: boolean) => void
  setOnlyEdges: (onlyEdges: boolean) => void
  setGridVisible: (isGridVisible: boolean) => void
}

export type SearchState = {
  isSearching: boolean
} & SearchResult

export type SearchActions = {
  startAlgorithm: (settings: AlgorithmSettings) => void
  setResult: (result: SearchResult) => void
  setFinalResult: (result: SearchResult) => void

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
  setContainer: (container: Container) => void
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
  setScene: (scene: Scene) => void
}
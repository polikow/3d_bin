import {CanvasState, Scene, Tab, TaskState, UIState} from "./types";
import {packing} from "../wailsjs/go/models"

export const container: packing.Container = {w: 2, h: 2, l: 2}

export const blocks: packing.Block[] = [
  {w: 1, h: 1, l: 1},
  {w: 1, h: 1, l: 1},
  {w: 1, h: 1, l: 1},
  {w: 1, h: 1, l: 1},
]

export const searchResult = {
  iteration: 0,
  value: 0,
  solution: [],
  packed: [],
  statuses: [],
} as unknown as packing.MultipleSearchResult

export const canvasState: CanvasState = {
  scene: Scene.Container,

  fov: 75,

  transparency: 0.3,
  isColorful: true,
  onlyEdges: false,

  isGridVisible: true,
  areLabelsVisible: true,

  cpus: 1,

  isDebugMode: false,
}

export const uiState: UIState = {
  tab: Tab.Settings
}

export const taskState: TaskState = {
  container,
  blocks,

  isSearching: false,
  searchResult,
}

export const state = {
  ...canvasState,
  ...uiState,
  ...taskState,
}
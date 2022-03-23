import {Container, SearchResult} from "../types";
import {
  BlocksState,
  CameraState,
  ContainerState,
  Scene,
  SceneState,
  SearchState,
  SettingsState,
  Tab,
  UIState
} from "./types";
import {blockCenter, blockPosition} from "./utils";

export const defaultContainer: Container = {w: 2, h: 2, l: 2}

export const cameraState: CameraState = {
  fov: 75,
  position: blockPosition(defaultContainer),
  target: blockCenter(defaultContainer),
}

export const settingsState: SettingsState = {
  opacity: 0.3,
  labelScale: 8,

  isColorful: true,
  isDebugMode: false,
  onlyEdges: false,
  targetContainer: true,
  isGridVisible: true,
}

export const searchResult: SearchResult = {
  iteration: 0,
  value: 0,
  solution: [],
  packed: [],
}

export const searchState: SearchState = {
  isSearching: false,
  ...searchResult
}

export const uiState: UIState = {
  tab: Tab.Nothing
}

export const containerState: ContainerState = {
  container: {w: 2, h: 2, l: 2}
}

export const blocksState: BlocksState = {
  blocks: [
    {w: 1, h: 1, l: 1},
    {w: 1, h: 1, l: 1},
    {w: 1, h: 1, l: 1},
    {w: 1, h: 1, l: 1},
  ]
}

export const sceneState: SceneState = {
  scene: Scene.Container
}
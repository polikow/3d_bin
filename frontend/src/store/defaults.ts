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
import {cargoAndSpace} from "./cargo";
import {containerCamera} from "./camera";
import {Container, MultipleSearchResult} from "../wailsjs/go/models"

export const container: Container = {w: 2, h: 2, l: 2}

export const cameraState: CameraState = {
  fov: 75,
  ...containerCamera(container)
}

export const settingsState: SettingsState = {
  transparency: 0.3,
  areLabelsVisible: true,

  isColorful: true,
  isDebugMode: false,
  onlyEdges: false,
  targetContainer: true,
  isGridVisible: true,

  cpus: 1
}

export const searchResult = MultipleSearchResult.createFrom({
  iteration: 0,
  value: 0,
  solution: [],
  packed: [],
  statuses: [],
})

export const searchState: SearchState = {
  isSearching: false,
  searchResult: searchResult,
}

export const uiState: UIState = {
  tab: Tab.Settings
}

export const containerState: ContainerState = {
  container
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

export const cargoSceneState = cargoAndSpace(blocksState.blocks)

export const state = {
  ...cameraState,
  ...sceneState,
  ...containerState,
  ...blocksState,
  ...searchState,
  ...uiState,
  ...settingsState,
  ...cargoSceneState
}
import create from "zustand"
import {objCenter, objPosition, objPositionForCargo} from "./utils";

const defaultContainer = {w: 2, h: 2, l: 2}
const emptyResultObj =  {
  iteration: null,
  value: null,
  solution: null,
  packed: [],
}

export const [useStore] = create(set => ({

  camera: {
    fov: 75,
    position: objPosition(defaultContainer),
    target: objCenter(defaultContainer),
  },
  setCamera: (camera) => set(() => ({camera})),

  isCargoScene: false,
  centerCameraAroundCargo: (cargo) => set(state => (
    {camera: centeredCameraCargo(cargo, state.camera.fov)})),


  container: defaultContainer,
  setContainer: (container) => set(state => state.targetContainer
    ? {
      container,
      camera: centeredCamera(container, state.camera.fov),
      ...emptyResultObj,
    }
    : {
      container,
      ...emptyResultObj,
    }
  ),

  blocks: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  setBlocks: (blocks) => set(() => ({
    blocks,
    ...emptyResultObj,
  })),


  isSearching: false,
  setSearching: (isSearching) => set(() => ({isSearching})),
  iteration: null,
  value: null,
  solution: null,
  packed: [],
  setResult: ({iteration, value, solution, packed}) =>
    set(() => ({iteration, value, solution, packed})),


  opacity: 0.3,
  setOpacity: (opacity) => set(() => ({opacity})),
  isColorful: true,
  setIsColorful: (isColorful) => set(() => ({isColorful})),
  isDebugMode: false,
  setIsDebugMode: (isDebugMode) => set(() => ({isDebugMode})),
  onlyEdges: false,
  setOnlyEdges: (onlyEdges) => set(() => ({onlyEdges})),
  targetContainer: true,
  setTargetContainer: (targetContainer) => set(state => targetContainer
    ? {
      targetContainer,
      camera: centeredCamera(state.container, state.camera.fov)
    }
    : {targetContainer}),
  grid: true,
  setGrid: (grid) => set(() => ({grid})),
  labelScale: 8,
  setLabelScale: (labelScale) => set(() => ({labelScale})),


  menu: {
    settings: false,
    packed: false,
    container: false,
    blocks: false,
    saveLoad: false,
    algorithm: false,
  },
  toggleMenuOption: (option) => () => {
    const menu = {
      settings: false,
      packed: false,
      container: false,
      blocks: false,
      saveLoad: false,
      algorithm: false,
    }
    if (menu[option] === undefined) {
      throw new Error(`no such option: ${option}`)
    }

    set(state => {
      menu[option] = !state.menu[option]
      if (option === "blocks") {
        return {
          menu,
          isCargoScene: true
        }
      } else if (state.isCargoScene) {
        return {
          menu,
          isCargoScene: false,
          camera: centeredCamera(state.container, state.camera.fov)
        }
      } else {
        return {menu}
      }
    })
  }
}))

function centeredCamera(obj, prevFOV) {
  return {
    fov: prevFOV,
    position: objPosition(obj),
    target: objCenter(obj)
  }
}

function centeredCameraCargo(cargo, prevFOV) {
  return {
    fov: prevFOV,
    position: objPositionForCargo(cargo),
    target: objCenter(cargo)
  }
}
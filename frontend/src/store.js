import create from "zustand"
import {objCenter, objPosition} from "./utils";

const defaultContainer = {w: 2, h: 2, l: 2}

export const [useStore] = create(set => ({

  camera: {
    fov: 75,
    position: objPosition(defaultContainer),
    target: objCenter(defaultContainer),
  },
  setCamera: (camera) => set(() => ({camera})),

  container: {w: 2, h: 2, l: 2},
  setContainer: (container) => set(state => {
    if (state.targetContainer) {
      const camera = {
        fov: state.camera.fov,
        position: objPosition(container),
        target: objCenter(container)
      }
      return {camera, container}
    } else {
      return {container}
    }
  }),

  isCargoScene: false,
  updateCargoSceneCamera: (position, target) => set(state=> {
    const camera = {
      fov: state.camera.fov,
      position: position,
      target: target,
    }
    return {camera}
  }),


  blocks: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  setBlocks: (blocks) => set(() => ({blocks})),


  iteration: null,
  value: null,
  solution: null,
  packed: [],
  setResult: ({iteration, value, solution, packed}) =>
    set(()=> {
      console.log("packed: ", packed)
      return ({iteration, value, solution, packed});
    }),
  doneEvaluating: (iteration) => set(()=>({iteration})),


  opacity: 0.5,
  setOpacity: (opacity) => set(() => ({opacity})),
  isColorful: true,
  setIsColorful: (isColorful) => set(() => ({isColorful})),
  isDebugMode: false,
  setIsDebugMode: (isDebugMode) => set(() => ({isDebugMode})),
  onlyEdges: false,
  setOnlyEdges: (onlyEdges) => set(() => ({onlyEdges})),
  hasGaps: false,
  setHasGaps: (hasGaps) => set(() => ({hasGaps})),
  targetContainer: true,
  setTargetContainer: (targetContainer) => set(state=> {
    if (targetContainer) {
      console.log("focus on container")
      const camera = {
        fov: state.camera.fov,
        position: objPosition(state.container),
        target: objCenter(state.container)
      }
      return {targetContainer, camera}
    } else {
      return {targetContainer}
    }
  }),

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
        return {menu, isCargoScene: true}

      } else if (state.isCargoScene) {
        const camera = {
          fov: state.camera.fov,
          position: objPosition(state.container),
          target: objCenter(state.container)
        }
        return {menu, isCargoScene: false, camera}

      } else {
        return {menu}
      }
    })
  }
}))
import create from "zustand"
import {Scene, Store, Tab,} from "./types";
import * as DEFAULT from "./defaults"
import {generateRandomBlocks, load, runAlgorithm, save} from "../bindings";
import {Block} from "../types";

const fileFilter = "*.json"

const success = (text: string) => () => console.log(text)
const fail = (text: string) => (error?: Error) => console.error(text, error)

export const useStore = create<Store>((set, get) => ({

  ...DEFAULT.cameraState,
  setFOV: fov => set(() => ({fov})),
  setPositionAndTarget: (position, target) => set(() => ({position, target})),

  ...DEFAULT.sceneState,
  setScene: scene => set(() => ({scene})),

  ...DEFAULT.containerState,
  setContainer: container => set(() => ({container})),
  ...DEFAULT.blocksState,
  replaceBlocks: blocks => set(() => ({blocks})),
  addNewBlock: block => set((state) => ({blocks: [...state.blocks, block]})),
  removeBlockByIndex: index => set((state) => ({
    blocks: [...state.blocks.slice(0, index), ...state.blocks.slice(index + 1)]
  })),
  changeBlockByIndex: (index, block) => set((state) => ({
    blocks: state.blocks.map((b, i) => {
      if (i != index) {
        return b
      } else {
        return block
      }
    })
  })),
  generateRandomBlocks: () => {
    generateRandomBlocks(get().container)
      .then((blocks: Array<Block>) => set(() => ({blocks})))
      .catch(fail("failed to generate new blocks!"))
  },
  saveTask: () => {
    const data = {container: get().container, blocks: get().blocks}
    save("Сохранить задачу в файл...", fileFilter, data)
      .then(success("saved!"))
      .catch(fail("failed to save"))
  },
  loadTask: () => {
    load("Загрузить задачу из файла...", fileFilter)
      .then(({container, blocks}) => {
        if (container === undefined || blocks === undefined) {
          throw new Error("wrong task file format!")
        }
        set(() => ({container, blocks, ...DEFAULT.searchResult}))
      })
      .catch(fail("failed to load from file"))
  },

  ...DEFAULT.searchState,
  startAlgorithm: (settings) => {
    runAlgorithm(get().container, get().blocks, settings)
      .then(() => {
        success("started algorithm")
        set(() => ({isSearching: true}))
      })
      .catch(() => {
        fail("failed to start algorithm")
        set(() => ({isSearching: false}))
      })
  },
  setResult: result => set(() => ({...result})),
  setFinalResult: result => {
  },  // TODO IMPLEMENT
  saveSolution: () => {
    const state = get()
    const data = {
      iteration: state.iteration,
      value: state.value,
      solution: state.solution,
      packed: state.packed
    }
    save("Сохранить решение в файл...", fileFilter, data)
      .then(success("saved!"))
      .catch(fail("failed to save solution"))
  },
  loadSolution: () => {
    load("Загрузить решение из файла...", fileFilter)
      .then(({iteration, value, solution, packed}) => {
        if (iteration === undefined || value === undefined ||
          solution === undefined || packed === undefined) {
          throw new Error("wrong solution file format")
        }
        set(() => ({iteration, value, solution, packed, tab: Tab.Algorithm}))
      })
      .then(success("loaded"))
      .catch(fail("failed to load solution"))
  },

  ...DEFAULT.uiState,
  setTab: newTab => {
    const state = get()
    switch (true) {
      // Переключение на ту же самую вкладку закрывает ее
      case state.tab === newTab:
        return {tab: Tab.Nothing}

      // Переключение на вкладку "Грузы" активирует соответствующую сцену, если
      // она не была уже активирована
      case newTab === Tab.Blocks && state.scene !== Scene.Cargo:
        return {
          tab: newTab,
          scene: Scene.Cargo,

          // position: overviewOfBounds(bounds),
          // target: centerOf(bounds)
        }

      // Переключение на вкладку "Контейнер" активирует соответствующую сцену, если
      // она не была уже активирована
      case newTab === Tab.Container || newTab === Tab.Algorithm && state.scene !== Scene.Container:
        return {
          tab: newTab,
          scene: Scene.Container,

          // position: overviewOfContainer(state.container),
          // target: centerOf(state.container)
        }

      // Переключение на новую вкладку
      case (newTab in Tab):
        return {currentTab: newTab}

      default:
        fail("wrong newTab specified")()
        return {}
    }
  },

  ...DEFAULT.settingsState,
  setOpacity: opacity => set(() => ({opacity})),
  setLabelScale: labelScale => set(() => ({labelScale})),
  setColorful: isColorful => set(() => ({isColorful})),
  setDebugMode: isDebugMode => set(() => ({isDebugMode})),
  setOnlyEdges: onlyEdges => set(() => ({onlyEdges})),
  setGridVisible: isGridVisible => set(() => ({isGridVisible})),
}))
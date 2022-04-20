import create from "zustand"
import {Scene, Store, Tab,} from "./types";
import * as DEFAULT from "./defaults"
import {blockPositionForBlockAtIndex, cargoAndSpace, doesBlockFitInside, spaceNeedsToBeShrunk} from "./cargo";
import {cargoCamera, containerCamera} from "./camera";
import {log, logError, replaced, withoutIndex, withoutLast} from "./utils";
import {MultipleSearchResult, SearchResult, Task} from "../wailsjs/go/models";

export const useStore = create<Store>((set, get) => ({
  ...DEFAULT.state,

  setFOV: fov => set({fov}),
  setPositionAndTarget: (position, target) => set({position, target}),

  setContainerSide: (side, value) => {
    const {container: oldContainer} = get()
    if (oldContainer[side] === value) return
    const container = {...oldContainer, [side]: value}
    set({
      container,
      searchResult: DEFAULT.searchResult,
      ...containerCamera(container),
    })
  },
  replaceBlocks: blocks => {
    const {cargo, space} = cargoAndSpace(blocks)
    const cameraSettings = (get().scene === Scene.Cargo)
      ? cargoCamera(blocks, space)
      : {}
    set({
      blocks, cargo, space,
      searchResult: DEFAULT.searchResult,
      ...cameraSettings
    })
  },
  addNewBlock: block => {
    const {blocks: oldBlocks, cargo: oldCargo, space: oldSpace} = get()
    const blocks = [...oldBlocks, block]
    const index = oldBlocks.length
    if (doesBlockFitInside(block, oldSpace)) {
      set({
        blocks,
        searchResult: DEFAULT.searchResult,
        cargo: [...oldCargo, blockPositionForBlockAtIndex(block, index, oldSpace)]
      })
    } else {
      const {cargo, space} = cargoAndSpace(blocks)
      set({
        blocks,
        cargo, space,
        searchResult: DEFAULT.searchResult,
        ...cargoCamera(blocks, space)
      })
    }
  },
  removeBlockByIndex: index => {
    const {blocks: oldBlocks, space: oldSpace, cargo: oldCargo} = get()
    const blocks = withoutIndex(oldBlocks, index)
    if (spaceNeedsToBeShrunk(oldBlocks, oldSpace)) {
      const {cargo, space} = cargoAndSpace(blocks)
      set({
        blocks, cargo, space,
        searchResult: DEFAULT.searchResult,
        ...cargoCamera(blocks, space)
      })
    } else {
      const cargo = withoutLast(oldCargo)
      set({
        blocks, cargo,
        searchResult: DEFAULT.searchResult,
        ...cargoCamera(blocks, oldSpace)
      })
    }
  },
  changeBlockByIndex: (i, b) => {
    const {blocks: oldBlocks, cargo: oldCargo, space: oldSpace} = get()
    const blocks = replaced(oldBlocks, b, i)
    if (!doesBlockFitInside(b, oldSpace) || spaceNeedsToBeShrunk(blocks, oldSpace)) {
      const {cargo, space} = cargoAndSpace(blocks)
      set({
        blocks,
        cargo, space,
        searchResult: DEFAULT.searchResult,
        ...cargoCamera(blocks, space)
      })
    } else {
      set({
        blocks,
        searchResult: DEFAULT.searchResult,
        cargo: replaced(oldCargo, blockPositionForBlockAtIndex(b, i, oldSpace), i)
      })
    }
  },
  generateRandomBlocks: () => {
    window.go.main.App.Generate(get().container)
      .then(result => {
        if (result instanceof Error) return logError(result)
        get().replaceBlocks(result)
      })
      .catch(logError)
  },
  saveTask: () => {
    const {container, blocks} = get()
    window.go.main.App.SaveTask({container, blocks} as Task)
      .then(log)
      .catch(logError)
  },
  loadTask: () => {
    window.go.main.App.LoadTask()
      .then(result => {
        if (result instanceof Error) return logError(result)
        const {container, blocks} = result
        const {cargo, space} = cargoAndSpace(blocks)
        const cameraSettings = (get().scene === Scene.Cargo)
          ? cargoCamera(blocks, space)
          : containerCamera(container)
        set({
          blocks, container,
          cargo, space,
          ...cameraSettings,
          ...DEFAULT.searchState,
        })
      })
      .catch(logError)
  },

  startBCA: (settings) => {
    log(settings)
    const {container, blocks, cpus, searchStarted, searchFailedToStart} = get()
    const task = {container, blocks} as Task
    window.go.main.App.RunBCA(task, settings, cpus)
      .then(searchStarted)
      .catch(searchFailedToStart)
  },
  startGA: (settings) => {
    log(settings)
    const {container, blocks, cpus, searchStarted, searchFailedToStart} = get()
    const task = {container, blocks} as Task
    window.go.main.App.RunGA(task, settings, cpus)
      .then(searchStarted)
      .catch(searchFailedToStart)
  },
  searchStarted: () => {
    log("searchStarted")
    set({isSearching: true})
  },
  searchFailedToStart: (reason: any) => {
    logError(reason)
    set({isSearching: false})
  },
  setSearchResult: searchResult => set({searchResult}),
  saveSolution: () => {
    window.go.main.App.SaveSearchResult(
      SearchResult.createFrom(get().searchResult)
    )
      .then(log)
      .catch(logError)
  },
  loadSolution: () => {
    window.go.main.App.LoadSearchResult()
      .then(searchResult => {
        if (searchResult instanceof Error) return logError(searchResult)
        set({
          searchResult: MultipleSearchResult.createFrom({
            ...searchResult,
            statuses: [],
          })
        })
      })
      .catch(logError)
  },

  setTab: newTab => {
    const {tab: oldTab, scene, container, blocks, space} = get()
    switch (true) {
      // Переключение на ту же самую вкладку закрывает ее
      case newTab === oldTab:
        return set({tab: Tab.Nothing})

      // Переключение на вкладку "Грузы" активирует соответствующую сцену, если
      // она не была уже активирована
      case newTab === Tab.Blocks && scene !== Scene.Cargo:
        return set({
          tab: newTab,
          scene: Scene.Cargo,
          ...cargoCamera(blocks, space)
        })

      // Переключение на вкладку "Контейнер" активирует соответствующую сцену, если
      // она не была уже активирована
      case newTab === Tab.Container || newTab === Tab.Algorithm && scene !== Scene.Container:
        return set({
          tab: newTab,
          scene: Scene.Container,
          ...containerCamera(container)
        })
      // Переключение на новую вкладку
      case (newTab in Tab):
        return set({tab: newTab})

      default:
        return logError("wrong newTab specified")
    }
  },

  setOpacity: opacity => set({opacity}),
  setLabelScale: labelScale => set({labelScale}),
  setColorful: isColorful => set({isColorful}),
  setDebugMode: isDebugMode => set({isDebugMode}),
  setOnlyEdges: onlyEdges => set({onlyEdges}),
  setGridVisible: isGridVisible => set({isGridVisible}),

  setCPUs: cpus => set({cpus}),
}))

const handleResult = (data: any) => {
  useStore.getState().setSearchResult(data)
}
const handleDoneSearching = () => {
  useStore.setState({isSearching: false})
}
window.runtime.EventsOn("result", handleResult)
window.runtime.EventsOn("doneSearching", handleDoneSearching)
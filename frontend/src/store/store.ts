import create, {GetState, Mutate, SetState, StoreApi} from "zustand"
import {subscribeWithSelector} from "zustand/middleware";
import {Scene, Store, Tab,} from "./types";
import * as DEFAULT from "./defaults"
import {log, logError, replaced, withoutIndex} from "./utils";
import {MultipleSearchResult, SearchResult, Task} from "../wailsjs/go/models";

export const useStore = create<Store,
  SetState<Store>,
  GetState<Store>,
  Mutate<StoreApi<Store>, [["zustand/subscribeWithSelector", never]]>>
(subscribeWithSelector((set, get) => ({
  ...DEFAULT.state,

  setFOV: fov => set({fov}),

  setTransparency: transparency => set({transparency}),
  setColorful: isColorful => set({isColorful}),
  setOnlyEdges: onlyEdges => set({onlyEdges}),

  setGridVisible: isGridVisible => set({isGridVisible}),
  setLabelsVisible: areLabelsVisible => set({areLabelsVisible}),

  setCPUs: cpus => set({cpus}),

  setDebugMode: isDebugMode => set({isDebugMode}),

  setTab: tab => {
    const {tab: oldTab, scene} = get()
    switch (true) {
      // Переключение на ту же самую вкладку закрывает ее
      case tab === oldTab:
        return set({tab: Tab.Nothing})

      // Переключение на вкладку "Грузы" активирует соответствующую сцену, если
      // она не была уже активирована
      case tab === Tab.Blocks && scene !== Scene.Cargo:
        return set({
          tab,
          scene: Scene.Cargo,
        })

      // Переключение на вкладку "Контейнер" активирует соответствующую сцену, если
      // она не была уже активирована
      case tab === Tab.Container || tab === Tab.Algorithm && scene !== Scene.Container:
        return set({
          tab,
          scene: Scene.Container,
        })
      // Переключение на новую вкладку
      case (tab in Tab):
        return set({tab})

      default:
        return logError("wrong tab specified")
    }
  },

  setContainerSide: (side, value) => {
    set(({container}) => ({
      container: {...container, [side]: value},
      searchResult: DEFAULT.searchResult,
    }))
  },

  replaceBlocks: blocks => {
    set({
      blocks,
      searchResult: DEFAULT.searchResult,
    })
  },
  addNewBlock: block => {
    set(({blocks}) => ({
      blocks: [...blocks, block],
      searchResult: DEFAULT.searchResult
    }))
  },
  removeBlockByIndex: index => {
    set(({blocks}) => ({
      blocks: withoutIndex(blocks, index),
      searchResult: DEFAULT.searchResult
    }))
  },
  changeBlockByIndex: (i, b) => {
    set(({blocks}) => ({
      blocks: replaced(blocks, b, i),
      searchResult: DEFAULT.searchResult
    }))
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
        set({
          blocks, container,
          searchResult: DEFAULT.searchResult,
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
})))

const handleResult = (data: any) => {
  useStore.getState().setSearchResult(data)
}
const handleDoneSearching = () => {
  useStore.setState({isSearching: false})
}
window.runtime.EventsOn("result", handleResult)
window.runtime.EventsOn("doneSearching", handleDoneSearching)
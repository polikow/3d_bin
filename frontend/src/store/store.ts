import create, {GetState, Mutate, SetState, StoreApi} from "zustand"
import {subscribeWithSelector} from "zustand/middleware";
import {Scene, Store, Tab,} from "./types";
import * as DEFAULT from "./defaults"
import {replaced, withoutIndex} from "./utils";
import {packing} from "../../wailsjs/go/models";
import {Generate, LoadSearchResult, LoadTask, RunBCA, RunGA, SaveSearchResult, SaveTask} from "../../wailsjs/go/main/App"
import {EventsOn} from "../../wailsjs/runtime";

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
        return console.error("wrong tab specified")
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
    Generate(get().container)
      .then(get().replaceBlocks)
      .catch(console.error)
  },

  saveTask: () => {
    const {container, blocks} = get()
    SaveTask({container, blocks} as packing.Task)
      .then(console.log)
      .catch(console.error)
  },
  loadTask: () => {
    LoadTask()
      .then(result => {
        if (result instanceof Error) return console.error(result)
        const {container, blocks} = result
        set({
          blocks, container,
          searchResult: DEFAULT.searchResult,
        })
      })
      .catch(console.error)
  },

  startBCA: (settings) => {
    console.log(settings)
    const {container, blocks, cpus, searchStarted, searchFailedToStart} = get()
    const task = {container, blocks} as packing.Task
    RunBCA(task, settings, cpus)
      .then(searchStarted)
      .catch(searchFailedToStart)
  },
  startGA: (settings) => {
    console.log(settings)
    const {container, blocks, cpus, searchStarted, searchFailedToStart} = get()
    const task = {container, blocks} as packing.Task
    RunGA(task, settings, cpus)
      .then(searchStarted)
      .catch(searchFailedToStart)
  },

  searchStarted: () => {
    console.log("searchStarted")
    set({isSearching: true})
  },
  searchFailedToStart: (reason: any) => {
    console.error(reason)
    set({isSearching: false})
  },

  // ИСПОЛЬЗОВАТЬ ТОЛЬКО ДЛЯ ОБНОВЛЕНИЯ ВО ВРЕМЯ ПОИСКА
  setSearchResult: searchResult => {
    const oldSearchResult = get().searchResult
    // решение не улучшено - заменяем только статусы
    if (searchResult.value === oldSearchResult.value) {
      set({
        searchResult: {
          value: oldSearchResult.value,
          solution: oldSearchResult.solution,
          packed: oldSearchResult.packed,

          iteration: searchResult.iteration,
          statuses: searchResult.statuses
        } as packing.MultipleSearchResult
      })
      // решение улучшено - заменяем все на новое
    } else {
      set({searchResult})
    }
  },

  saveSolution: () => {
    SaveSearchResult(
      {
        solution: get().searchResult.solution,
        packed: get().searchResult.packed,
        iteration: get().searchResult.iteration,
        value: get().searchResult.value,
      } as packing.SearchResult
    )
      .then(console.log)
      .catch(console.error)
  },
  loadSolution: () => {
    LoadSearchResult({
      task: get().container,
      blocks: get().blocks
    } as unknown as packing.Task)
      .then(searchResult => {
        if (searchResult instanceof Error) return console.error(searchResult)
        set({
          searchResult: {
            value: searchResult.value,
            iteration: searchResult.iteration,
            statuses: [],
            solution: searchResult.solution,
            packed: searchResult.packed
          } as unknown as packing.MultipleSearchResult
        })
      })
      .catch(console.error)
  },
})))

const handleResult = (data: any) => {
  useStore.getState().setSearchResult(data)
}
const handleDoneSearching = () => {
  useStore.setState({isSearching: false})
}
EventsOn("result", handleResult)
EventsOn("doneSearching", handleDoneSearching)
import {AlgorithmSettings, Block, Container} from "./types";

// TODO remove ignores

export function subscribe(eventName: string, callback: Function) {
  // @ts-ignore
  window.wails.Events.On(eventName, callback)
}

export function save(title: string, filter: string, data: any) {
  // @ts-ignore
  return window.backend.App.Save(
    title,
    filter,
    JSON.stringify(data, null, 2)
  )
}

export async function load(title: string, filter: string) {
  // @ts-ignore
  const data = await window.backend.App.Load(title, filter)
  return JSON.parse(data)
}

export function runAlgorithm(container: Container, blocks: Array<Block>, settings: AlgorithmSettings) {
  console.log("runAlgorithm")
  const data = JSON.stringify({container, blocks, ...settings});
  console.log(data)
  // @ts-ignore
  return window.backend.App.RunAlgorithm(data)
}

export function generateRandomBlocks(container: Container) {
  let data = JSON.stringify(container)
  // @ts-ignore
  return window.backend.App.Generate(data)
}
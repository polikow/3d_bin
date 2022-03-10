import {blockToBlockObj} from "./utils";

export function AppEvent(event, callback) {
  window.wails.Events.On(event, callback)
}

export function AppSave(title, filter, data) {
  return window.backend.App.Save(
    title,
    filter,
    JSON.stringify(data, null, 2)
  )
}

export async function AppLoad(title, filter) {
  const data = await window.backend.App.Load(title, filter)
  return JSON.parse(data)
}

export function AppRunAlgorithm(container, blocks, settings) {
  let data = JSON.stringify({
    container: container,
    blocks: blocks.map(blockToBlockObj),
    ...settings
  })
  console.log(data)
  return window.backend.App.RunAlgorithm(data)
}

export function AppGenerateRandomBlocks(container) {
  let data = JSON.stringify(container)
  return window.backend.App.Generate(data)
}
export function AppEvent(event: string, callback: function) {
  window.wails.Events.On(event, callback)
}

function jsonArrayReplacer(k, v) {
  if (v instanceof Array)
    return JSON.stringify(v)
  else
    return v
}

export function AppSave(title: string, filter: string, data: any): Promise<any> {
  return window.backend.App.Save(
    title,
    filter,
    JSON.stringify(data, jsonArrayReplacer, 2)
  )
}

export async function AppLoad(title: string, filter: string): Promise<any> {
  const data = await window.backend.App.Load(title, filter)
  return JSON.parse(data)
}

export function AppRunAlgorithm(container, blocks, settings): Promise<any> {
  let data = JSON.stringify({
    container: container,
    blocks: blocks.map(blockToBlockObject),
    ...settings
  })
  console.log(data)
  return window.backend.App.RunAlgorithm(data)
}

function blockToBlockObject(block) {
  return {
    w: block[0],
    h: block[1],
    l: block[2],
  }
}
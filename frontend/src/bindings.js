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

export function AppRunAlgorithm(algorithm, settings, container, blocks) {
  window.backend.App.RunAlgorithm({
    algorithm,
    settings,
    container,
    blocks
  }).then(console.log)
}
export const compareStateSlices = (prev: Array<any>, next: Array<any>) => {
  if (prev.length === 0) return false
  if (prev.length !== next.length) throw Error

  for (let i = 0; i < prev.length; i++) {
    if (prev[i] instanceof Function) continue
    if (prev[i] !== next[i]) return false
  }
  return true
}

export const compareState = <T>(prev: T, next: T) => prev === next

export const compareAlwaysTrue = () => true
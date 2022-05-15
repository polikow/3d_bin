export const replaced = <T>(a: Array<T>, newValue: T, index: number) =>
  a.map((v, i) => i != index ? v : newValue)

export const withoutIndex = <T>(a: Array<T>, i: number) =>
  [...a.slice(0, i), ...a.slice(i + 1)]

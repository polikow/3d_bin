export const replaced = <T>(a: Array<T>, newValue: T, index: number) =>
  a.map((v, i) => i != index ? v : newValue)

export const withoutLast = <T>(a: Array<T>) =>
  a.filter((_, i) => i < a.length - 1)

export const withoutIndex = <T>(a: Array<T>, i: number) =>
  [...a.slice(0, i), ...a.slice(i + 1)]

export const log = (text: any) => console.log(text)
export const logError = (text: any) => console.error(text)

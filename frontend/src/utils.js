export const changeStateObj = (stateObj, stateObjKey, newValue) => {
  if (stateObj[stateObjKey] === undefined) {
    throw new Error(`key "${stateObjKey}" is not declared`)
  }

  let stateChanged = false

  const newStateObj = {}
  for (const [key, value] of Object.entries(stateObj)) {
    if (key === stateObjKey) {
      if (value !== newValue) {
        newStateObj[key] = newValue
        stateChanged = true
      }
    } else {
      newStateObj[key] = value
    }
  }

  return [newStateObj, stateChanged]
}

export const changeStateArray = (stateArray, stateArrayIndex, newValue) => {
  if (stateArray[stateArrayIndex] === undefined) {
    throw new Error(`index "${stateArrayIndex}" is not declared`)
  }

  if (stateArray[stateArrayIndex] === newValue) {
    return [null, false]
  } else {
    const newStateArray = stateArray.slice()
    newStateArray[stateArrayIndex] = newValue
    return [newStateArray, true]
  }
}

export function roundFloat(f, decimals) {
  return parseFloat(parseFloat(f).toFixed(decimals))
}

export function arrayN(n) {
  let a = new Array(n)
  for (let i = 0; i < a.length; i++) {
    a[i] = i + 1
  }
  return a
}

const yShift = 0.8
const zShift = 0.8

export function objPosition(obj) {
  if (obj instanceof Array) {
    return [obj[0] * 2, obj[1] * 2 * yShift, obj[2] * 2 * zShift]

  } else if (obj instanceof Object) {
    const v = Object.values(obj)
    return [v[0] * 2, v[1] * 2 * yShift, v[2] * 2 * zShift]

  } else {
    throw new Error("can't find position for the obj: " + obj)
  }
}

export function objPositionForCargo(obj) {
  if (obj instanceof Array) {
    return [obj[0] / 2, obj[1] * 15, obj[2]  / 2 + obj[2]]

  } else if (obj instanceof Object) {
    const v = Object.values(obj)
    return [v[0] / 2, v[1] * 10, v[2] / 2]

  } else {
    throw new Error("can't find position for the obj: " + obj)
  }
}

export function objCenter(obj) {
  if (obj instanceof Array) {
    return [obj[0] / 2, obj[1] / 2, obj[2] / 2]

  } else if (obj instanceof Object) {
    const v = Object.values(obj)
    return [v[0] / 2, v[1] / 2, v[2] / 2]

  } else {
    throw new Error("can't find position for the obj: " + obj)
  }
}

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
    return [obj[0] / 2, obj[1] * 15, obj[2] / 2 + obj[2]]

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

export function blockToBlockObj(block) {
  return {
    w: block[0],
    h: block[1],
    l: block[2],
  }
}

export function blockObjToBlock(block) {
  return [
    block.w,
    block.h,
    block.l,
  ]
}

export function integerFromTextField(event, errorValue) {
  if (typeof event.target.value === "string" && event.target.value !== "") {
    return parseInt(event.target.value)
  } else {
    return errorValue
  }
}

export function floatFromTextField(event, errorValue) {
  if (typeof event.target.value === "string" && event.target.value !== "") {
    return parseFloat(event.target.value)
  } else {
    return errorValue
  }
}

export function keepInBounds(newValue, min, max) {
  if (newValue < min) {
    newValue = min
  }
  if (newValue > max) {
    newValue = max
  }
  return newValue;
}

export const rotations = ["XYZ", "ZYX", "XZY", "YZX", "ZXY", "YXZ"]
import React from "react";
import {colors} from "./consts";
import {Box3, Object3D, Vector3} from "three";

export type Event = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined;

export function integerInBounds(event: Event, defaultValue: number, min: number, max: number): number {
  if (event === undefined) return defaultValue
  if (event.target === undefined) return defaultValue
  if (event.target.value === undefined) return defaultValue


  const value = parseInt(event.target.value)
  if (isNaN(value)) return min
  if (value < min) return min
  if (value > max) return max
  return value
}

export function floatInBounds(event: Event, defaultValue: number, min: number, max: number): number {
  if (event === undefined) return defaultValue
  if (event.target === undefined) return defaultValue
  if (event.target.value === undefined) return defaultValue

  const value = parseFloat(event.target.value)
  if (isNaN(value)) return min
  if (value < min) return min
  if (value > max) return max
  return value
}

export const colorOf = (index: number) => colors[index % colors.length]

const size = new Vector3()
const center = new Vector3()
const bbox = new Box3()
export const boundsAndCenter = (o: Object3D) => {
  bbox.setFromObject(o)
  return [bbox.getSize(size), bbox.getCenter(center)] as [Vector3, Vector3]
}
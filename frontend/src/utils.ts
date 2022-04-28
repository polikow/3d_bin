import React from "react";
import {colors} from "./consts";

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
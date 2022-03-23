import React from "react";

export type Event = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined;

export function integerInBounds(event: Event, defaultValue: number, min: number, max: number): number {
  if (event === undefined) return defaultValue

  const value = parseInt(event.target.value)
  if (value < min) return min
  if (value > max) return max
  return value
}

export function floatInBounds(event: Event, defaultValue: number, min: number, max: number): number {
  if (event === undefined) return defaultValue

  const value = parseFloat(event.target.value)
  if (value < min) return min
  if (value > max) return max
  return value
}

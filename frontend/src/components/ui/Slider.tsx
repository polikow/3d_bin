import React from "react";
import {Slider, Typography} from "@material-ui/core";

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange?: (event: Event, value: number) => void
}

export default ({label, value, onChange, min, max, step}: SliderProps) => (
  <>
    <Typography>{label}</Typography>
    <Slider
      value={value}
      min={min}
      max={max}
      step={step}
      // @ts-ignore
      onChange={onChange}
    />
  </>
)
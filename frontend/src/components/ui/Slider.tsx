import React from "react";
import {Slider as MuiSlider, Typography} from "@mui/material";

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange?: (event: Event, value: number) => void
}

const Slider = ({label, value, onChange, min, max, step}: SliderProps) => (
  <>
    <Typography>{label}</Typography>
    <MuiSlider
      size="small"
      value={value}
      min={min}
      max={max}
      step={step}
      // @ts-ignore
      onChange={onChange}
    />
  </>
)

export default Slider
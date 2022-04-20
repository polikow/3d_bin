import React from "react";
import {Slider as MuiSlider, Typography} from "@mui/material";

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  marks?: boolean
  valueLabelDisplay?: boolean
  disabled?: boolean
  onChange?: (event: Event, value: number) => void
}

const Slider = ({
                  label,
                  value,
                  min,
                  max,
                  step,
                  marks = false,
                  valueLabelDisplay = false,
                  disabled = false,
                  onChange
                }: SliderProps) => (
  <>
    <Typography>{label}</Typography>
    <MuiSlider
      size="small"
      value={value}
      min={min}
      max={max}
      step={step}
      marks={marks}
      valueLabelDisplay={valueLabelDisplay ? "auto" : "off"}
      disabled={disabled}
      // @ts-ignore
      onChange={onChange}
    />
  </>
)

export default Slider
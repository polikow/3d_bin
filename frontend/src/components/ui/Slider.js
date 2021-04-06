import {Slider, Typography} from "@material-ui/core";
import React from "react";

export default ({label, value, onChange, min, max, step}) => (
  <>
    <Typography>{label}</Typography>
    <Slider min={min} max={max} step={step}
            value={value}
            onChange={onChange}/>
  </>
)
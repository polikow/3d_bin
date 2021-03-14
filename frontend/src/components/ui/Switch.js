import {FormControlLabel, Switch} from "@material-ui/core";
import React from "react";

export default ({checked, onChange, label = "label", color = "primary"}) => (
  <FormControlLabel
    className="switch"
    labelPlacement="start"
    label={label}
    control={<Switch checked={checked} color={color} onChange={onChange}/>}
  />
)
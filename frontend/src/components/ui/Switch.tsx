import React from "react";
import {FormControlLabel, Switch} from "@material-ui/core";

interface SwitchProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  label?: string
  color?: 'primary' | 'secondary' | 'default'
}

export default ({checked, onChange, label = "label", color = "primary"}: SwitchProps) => (
  <FormControlLabel
    className="switch"
    labelPlacement="start"
    label={label}
    control={
      <Switch
        checked={checked}
        color={color}
        onChange={onChange}
      />
    }
  />
)
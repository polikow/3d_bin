import React from "react";
import {FormControlLabel, styled, Switch} from "@mui/material";

interface Props {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  label: string
  color?: 'primary' | 'secondary' | 'default'
}

const CustomFormControlLabel = styled(FormControlLabel)`
  justify-content: space-between;
  margin-left: 0;
`

const SwitchWithLabel = ({checked, onChange, label, color = "primary"}: Props) => (
  <CustomFormControlLabel
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

export default SwitchWithLabel
import React, {useCallback, useMemo, useState} from "react";
import {styled, TextField} from "@mui/material";
import {floatInBounds, integerInBounds} from "../../utils";

interface NumericInputProps {
  label: string
  name: string
  initial: number
  min: number
  max: number
  step: number
}

const CustomTextField = styled(TextField)`
  margin: 10px 0 !important;
`

const NumericInput = ({label, name, initial, min, max, step}: NumericInputProps) => {
  const [value, setValue] = useState(initial)
  const inputProps = useMemo(
    () => ({inputProps: {min, max, step}}),
    [min, max, step]
  )
  const handleChange = useCallback(
    event => setValue(Number.isInteger(step)
      ? integerInBounds(event, initial, min, max)
      : floatInBounds(event, initial, min, max)),
    [initial, min, max, step]
  )
  return (
    <CustomTextField
      type="number" variant="standard"
      label={label}
      name={name} value={value}
      InputProps={inputProps}
      onChange={handleChange}
    />
  )
}

export default NumericInput
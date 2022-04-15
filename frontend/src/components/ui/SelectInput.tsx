import React, {useState} from "react";
import {MenuItem, Select, styled} from "@mui/material";

interface SelectInputProps {
  defaultValue: string
  valuesLabels: Array<[string, string]>
  onChange?: (newValue: string) => void
}

const CustomSelect = styled(Select)`
  margin-top: 15px;
`

const SelectInput = ({defaultValue, valuesLabels, onChange}: SelectInputProps) => {
  const [value, setValue] = useState(defaultValue)
  const handleChange = (event: { target: { value: any; }; }) => {
    const newValue = event.target.value;
    setValue(value)
    if (onChange === undefined) return;
    onChange(newValue)
  }
  return (
    <CustomSelect
      variant="standard"
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      {valuesLabels.map((
        [value, label]) =>
        <MenuItem key={value} value={value}>{label}</MenuItem>
      )}
    </CustomSelect>
  )
}

export default SelectInput
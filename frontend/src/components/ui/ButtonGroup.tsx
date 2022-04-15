import React from "react";
import {ButtonGroup, styled, Typography} from "@mui/material";

interface ButtonGroupProps {
  label: string
  onClick?: React.MouseEventHandler
  children: React.ReactNode
}

const CustomTypography = styled(Typography)`
  margin-bottom: 3px;
`

const CustomButtonGroup = styled(ButtonGroup)`
  margin: 0 0 8px 0;

  > button {
    flex: 1;
  }
`

export default ({label, onClick, children}: ButtonGroupProps) => (
  <>
    <CustomTypography>{label}</CustomTypography>
    <CustomButtonGroup
      variant="contained"
      color="inherit"
      aria-label="contained button group"
      onClick={onClick}
    >
      {children}
    </CustomButtonGroup>
  </>
)
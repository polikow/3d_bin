import React from "react";
import {ButtonGroup, Typography} from "@material-ui/core";

interface ButtonGroupProps {
  label: string
  onClick?: React.MouseEventHandler
  children: React.ReactNode
}

export default ({label, onClick, children}: ButtonGroupProps) => (
  <>
    <Typography>{label}</Typography>
    <ButtonGroup
      variant="contained"
      color="default"
      aria-label="contained button group"
      className={"button-group"}
      onClick={onClick}
    >
      {children}
    </ButtonGroup>
  </>
)
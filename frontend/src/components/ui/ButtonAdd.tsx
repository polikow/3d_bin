import React from "react";
import {Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";

interface ButtonAddProps {
  disabled: boolean
  onClick?: React.MouseEventHandler
  children?: React.ReactNode
}

export default ({disabled, onClick, children}: ButtonAddProps) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled}
    onClick={onClick}
  >
    {children}
    <Add/>
  </Button>
)
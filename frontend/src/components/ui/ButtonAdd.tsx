import React from "react";
import {Button} from "@mui/material";
import {Add} from "@mui/icons-material";

interface ButtonAddProps {
  disabled: boolean
  onClick?: React.MouseEventHandler
  children?: React.ReactNode
}

const ButtonAdd = ({disabled, onClick, children}: ButtonAddProps) => (
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

export default ButtonAdd
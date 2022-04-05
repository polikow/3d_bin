import React from "react";
import {Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";

interface ButtonAddProps {
  title: string
  disabled: boolean
  onClick?: React.MouseEventHandler
}

export default ({title, onClick, disabled}: ButtonAddProps) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled}
    onClick={onClick}
  >
    {title}
    <Add/>
  </Button>
)
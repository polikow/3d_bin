import React from "react";
import {IconButton} from "@mui/material";
import {Create} from "@mui/icons-material";

interface ButtonCreateProps {
  onClick?: React.MouseEventHandler
}

const ButtonCreate = ({onClick}: ButtonCreateProps) => (
  <IconButton size="small" onClick={onClick}>
    <Create/>
  </IconButton>
)

export default ButtonCreate
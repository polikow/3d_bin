import React from "react";
import {IconButton} from "@mui/material";
import {Check} from "@mui/icons-material";

interface ButtonAcceptProps {
  onClick?: React.MouseEventHandler
}

const ButtonAccept = ({onClick}: ButtonAcceptProps) => (
  <IconButton size="small" onClick={onClick}>
    <Check/>
  </IconButton>
)

export default ButtonAccept
import React from "react";
import {IconButton} from "@material-ui/core";
import {Check} from "@material-ui/icons";

interface ButtonAcceptProps {
    onClick?: React.MouseEventHandler
}

export default ({onClick}: ButtonAcceptProps) => (
  <IconButton size="small" onClick={onClick}>
    <Check/>
  </IconButton>
)
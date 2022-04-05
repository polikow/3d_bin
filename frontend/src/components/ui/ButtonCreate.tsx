import React from "react";
import {IconButton} from "@material-ui/core";
import {Create} from "@material-ui/icons";

interface ButtonCreateProps {
  onClick?: React.MouseEventHandler
}

export default ({onClick}: ButtonCreateProps) => (
  <IconButton size="small" onClick={onClick}>
    <Create/>
  </IconButton>
)
import {IconButton} from "@material-ui/core";
import {Create} from "@material-ui/icons";
import React from "react";

export default ({onClick}) => (
  <IconButton size="small" onClick={onClick}>
    <Create/>
  </IconButton>
)
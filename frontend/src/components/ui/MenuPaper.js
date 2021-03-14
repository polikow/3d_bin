import {Paper} from "@material-ui/core";
import React from "react";
import SimplePaper from "./SimplePaper";
import MenuTitle from "./MenuTitle";

export default ({title = "", children, elevation = 3, classes}) => (
  <SimplePaper classes={classes} elevation={elevation}>
    {title !== "" && <MenuTitle title={title}/>}
    <Paper className="menu-elements-wrapper" elevation={0}>
      {children}
    </Paper>
  </SimplePaper>
)
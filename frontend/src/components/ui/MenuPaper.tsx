import React from "react";
import {Paper} from "@material-ui/core";
import SimplePaper from "./SimplePaper";
import MenuTitle from "./MenuTitle";

interface MenuPaperProps {
  title?: string
  elevation?: number
  classes?: string[]
  children: React.ReactNode
}

export default ({title = "", elevation = 3, classes, children}: MenuPaperProps) => (
  <SimplePaper classes={classes} elevation={elevation}>
    {title !== "" &&
      <MenuTitle title={title}/>
    }
    <Paper className="menu-elements-wrapper" elevation={0}>
      {children}
    </Paper>
  </SimplePaper>
)
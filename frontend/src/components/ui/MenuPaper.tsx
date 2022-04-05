import React from "react";
import {Paper} from "@material-ui/core";
import SimplePaper from "./SimplePaper";
import MenuTitle from "./MenuTitle";

interface MenuPaperProps {
  title?: string
  elevation?: number
  className?: string
  children: React.ReactNode
}

export default ({title = "", elevation = 3, className, children}: MenuPaperProps) => (
  <SimplePaper className={className} elevation={elevation}>
    {title !== "" &&
      <MenuTitle title={title}/>
    }
    <Paper className="menu-elements-wrapper" elevation={0}>
      {children}
    </Paper>
  </SimplePaper>
)
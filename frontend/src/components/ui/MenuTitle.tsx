import React from "react";
import {Typography} from "@material-ui/core";

interface MenuTitleProps {
  title: string
}

export default ({title}: MenuTitleProps) => (
  <Typography className="menu-title" align="center">
    {title}
  </Typography>
)
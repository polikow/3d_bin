import React from "react";
import {Paper} from "@material-ui/core";
import classNames from "classnames";

interface SimplePaperProps {
  elevation?: number
  className?: string
  children: React.ReactNode
}

export default ({elevation = 3, className, children}: SimplePaperProps) => (
  <Paper className={classNames("simple-paper", className)} elevation={elevation}>
    {children}
  </Paper>
)
import React from "react";
import {Paper} from "@material-ui/core";

interface SimplePaperProps {
  elevation?: number
  classes?: string[]
  children: React.ReactNode
}

export default ({elevation = 3, classes = [], children}: SimplePaperProps) => (
  <Paper className={`simple-paper ${classes.join(' ')}`} elevation={elevation}>
    {children}
  </Paper>
)
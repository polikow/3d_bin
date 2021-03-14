import {Paper} from "@material-ui/core";
import React from "react";

export default ({elevation = 3, children, classes = []}) => (
  <Paper className={`simple-paper ${classes.join(' ')}`} elevation={elevation}>
    {children}
  </Paper>
)
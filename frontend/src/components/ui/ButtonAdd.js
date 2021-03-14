import {Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import React from "react";

export default({title, onClick}) => (
  <Button variant="contained" color="primary" onClick={onClick}>
    {title} <Add/>
  </Button>
)
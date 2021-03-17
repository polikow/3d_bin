import {Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import React from "react";

export default({title, onClick, disabled}) => (
  <Button variant="contained" color="primary"
          disabled={disabled}
          onClick={onClick}>
    {title} <Add/>
  </Button>
)
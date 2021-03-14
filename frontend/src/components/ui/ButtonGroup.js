import {ButtonGroup, Typography} from "@material-ui/core";
import React from "react";

export default ({label, onClick, children}) => (
  <>
    <Typography>{label}</Typography>
    <ButtonGroup variant="contained" color="default"
                 aria-label="contained button group"
                 className={"button-group"}
                 onClick={onClick}>
      {children}
    </ButtonGroup>
  </>
)
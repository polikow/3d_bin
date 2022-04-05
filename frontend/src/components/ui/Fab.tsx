import React from "react";
import {Fab} from "@material-ui/core";

interface OptionProps {
  active: boolean
  onClick: () => void
  title?: string
  icon?: any
}

export default ({active, onClick, title, icon}: OptionProps) => (
  <Fab className="fab" variant="extended"
       color={active ? "primary" : "default"}
       onClick={onClick}
  >
    {icon}
    {title}
  </Fab>
)
import React from "react";
import {Fab as MuiFab} from "@mui/material";

interface OptionProps {
  active: boolean
  onClick: () => void
  title?: string
  icon?: any
}

const Fab = ({active, onClick, title, icon}: OptionProps) => (
  <MuiFab variant="extended"
          color={active ? "primary" : "default"}
          onClick={onClick}
  >
    {icon}
    {title}
  </MuiFab>
)

export default Fab
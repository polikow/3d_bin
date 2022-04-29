import React from "react";
import {Fab as MuiFab} from "@mui/material";

interface OptionProps {
  active: boolean
  onClick: () => void
  title?: string
  icon?: any
  disabled?: boolean
}

const Fab = ({active, onClick, title, icon, disabled = false}: OptionProps) => (
  <MuiFab
    variant="extended"
    color={active ? "primary" : "default"}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    {title}
  </MuiFab>
)

export default Fab
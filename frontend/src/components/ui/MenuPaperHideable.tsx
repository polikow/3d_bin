import React from "react";
import MenuPaper from "./MenuPaper";

interface MenuHideableProps {
  hidden: boolean
  className: string
  children: React.ReactNode
}

export default ({hidden, className, children}: MenuHideableProps) => (
  <MenuPaper classes={hidden ? ["hidden-left", className] : [className]}>
    {children}
  </MenuPaper>
)
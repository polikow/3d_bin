import MenuPaper from "./MenuPaper";
import React from "react";

export default ({hidden, children, className}) => (
  <MenuPaper classes={hidden ? ["hidden-left", className] : [className]}>
    {children}
  </MenuPaper>
)
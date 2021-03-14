import MenuPaper from "./MenuPaper";
import React from "react";

export default ({hidden, children}) => (
  <MenuPaper classes={hidden ? ["hidden-left"] : undefined}>
    {children}
  </MenuPaper>
)
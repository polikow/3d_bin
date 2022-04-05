import React from "react";
import MenuPaper from "./MenuPaper";
import classNames from "classnames";

interface MenuHideableProps {
  hidden: boolean
  className: string
  children: React.ReactNode
}

export default ({hidden, className, children}: MenuHideableProps) => (
  <MenuPaper className={classNames(className, {"hidden-left": hidden})}>
    {children}
  </MenuPaper>
)
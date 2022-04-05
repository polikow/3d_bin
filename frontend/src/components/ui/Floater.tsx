import React from "react";
import {IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import classNames from "classnames";

export type FloaterPosition = "top-left" | "top-right" | "bottom-right" | "bottom-left"
type Flow = "column" | "row"

interface FloaterProps {
  open: boolean
  onClose?: React.MouseEventHandler
  position?: FloaterPosition
  flow?: Flow
  className?: string
  children: React.ReactNode
}

const hiddenClassFor = (position: FloaterPosition) =>
  position === "top-left" || position === "bottom-left"
    ? "hidden-left"
    : "hidden-right"

export default ({open, onClose, position = "top-left", flow = "column", children, className}: FloaterProps) => (
  <div
    style={{flexFlow: flow}}
    className={classNames(
      "floater",
      position, flow, className,
      {[hiddenClassFor(position)]: !open}
    )}
  >
    {children}
    {onClose !== undefined &&
      <IconButton
        className={classNames(
          'floater-close-button',
          {[hiddenClassFor(position)]: !open}
        )}
        onClick={onClose}>
        <CloseIcon/>
      </IconButton>
    }
  </div>
)
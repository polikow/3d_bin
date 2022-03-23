import React from "react";
import {IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

export type FloaterPosition = "top-left" | "top-right" | "bottom-right" | "bottom-left"
type Flow = "column" | "row"

interface FloaterProps {
  open: boolean
  onClose?: React.MouseEventHandler
  position?: FloaterPosition
  flow?: Flow
  classes?: string[]
  children: React.ReactNode
}

const hiddenClassFor = (position: FloaterPosition) =>
  position === "top-left" || position === "bottom-left"
    ? "hidden-left"
    : "hidden-right"

export default ({open, onClose, position = "top-left", flow = "column", children, classes = []}: FloaterProps) => (
    <div
      style={{flexFlow: flow}}
      className={[
        "floater",
        position,
        flow,
        open ? "" : hiddenClassFor(position),
        ...classes
      ].join(" ")}
    >
      {children}
      {onClose !== undefined &&
        <IconButton
          className={`floater-close-button ${open ? "" : hiddenClassFor(position)}`}
          onClick={onClose}>
          <CloseIcon/>
        </IconButton>
      }
    </div>
  )
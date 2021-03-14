import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import {IconButton} from "@material-ui/core";

export default ({
                  open, onClose, position = "top-left", flow = "column", children,
                  classes = []
                }) => {
  if (
    position !== "top-left" &&
    position !== "top-right" &&
    position !== "bottom-left" &&
    position !== "bottom-right"
  ) throw new Error("wrong anchor specified")

  if (flow !== "column" && flow !== "row")
    throw new Error("wrong flow specified")

  const hiddenClass = position === "top-left" || position === "bottom-left"
    ? "hidden-left"
    : "hidden-right"

  const closeButton = (
    <IconButton
      className={`floater-close-button ${open ? "" : hiddenClass}`}
      onClick={onClose}>
      <CloseIcon/>
    </IconButton>
  )

  const _classes = [
    "floater", position, flow,
    open ? "" : hiddenClass,
    ...classes
  ]

  return (
    <div style={{flexFlow: flow}} className={_classes.join(" ")}>
      {children}
      {onClose !== undefined && closeButton}
    </div>
  )
}
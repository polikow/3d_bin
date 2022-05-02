/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx, css} from "@emotion/react";
import React from "react";
import {IconButton, styled, useTheme} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export type FloaterPosition = "top-left" | "top-right" | "bottom-right" | "bottom-left"
type Flow = "column" | "row"

interface FloaterProps {
  open: boolean
  onClose?: React.MouseEventHandler
  position?: FloaterPosition
  flow?: Flow
  className?: string
  children?: React.ReactNode
}

const hiddenLeft = css`transform: translateX(-120%);`
const hiddenRight = css`transform: translateX(120%);`

const hiddenStyle = (hidden: boolean, position: FloaterPosition) =>
  hidden
    ? position === "top-left" || position === "bottom-left"
      ? hiddenLeft
      : hiddenRight
    : undefined

const positionStyle = (position: FloaterPosition) => css`
  top: ${position?.includes("top") ? 0 : "initital"};
  bottom: ${position?.includes("bottom") ? 0 : "initital"};
  left: ${position?.includes("left") ? 0 : "initital"};
  right: ${position?.includes("right") ? 0 : "initital"};
`

const CustomIconButton = styled(IconButton)`
  position: absolute;
  top: 18px;
  right: -44px;
`

const Floater = React.forwardRef(
  ({open, onClose, position = "top-left", flow = "column", className, children}: FloaterProps,
   ref: React.ForwardedRef<HTMLDivElement>) => {
  const theme = useTheme()
  const duration = theme.transitions.duration.standard
  const easing = open
    ? theme.transitions.easing.easeOut
    : theme.transitions.easing.easeIn
  const zIndex = open
    ? 3
    : 2
  return (
    <div
      css={css`
        position: absolute;
        ${positionStyle(position)};
  
        display: flex;
        flex-flow: ${flow};
  
        z-index: ${zIndex};
  
        ${hiddenStyle(!open, position)};
        transition: transform ${duration}ms ${easing} 0ms;
      `}
      className={className}
      ref={ref}
    >
      {children}
      {onClose !== undefined &&
        <CustomIconButton onClick={onClose}>
          <CloseIcon/>
        </CustomIconButton>
      }
    </div>
  );
})

export default Floater
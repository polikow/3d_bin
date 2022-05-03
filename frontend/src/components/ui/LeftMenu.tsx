import React from "react";
import {IconButton, styled} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HiddenLeft from "./HiddenLeft";

const CustomIconButton = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 19px;
  color: white;
`

const CustomHiddenLeft = styled(HiddenLeft)`
  padding-right: 18px;
  padding-bottom: 10px;
  max-height: calc(100% - 90px);

  overflow-y: auto; 
  overflow-x: visible;

  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-flow: column;

  z-index: ${({open}) => open ? 3 : 2};
`

interface Props {
  open: boolean
  onClose?: React.MouseEventHandler
  children?: React.ReactNode
}

const LeftMenu = ({open, onClose, children}: Props) => {
  return (
      <CustomHiddenLeft open={open}>
        {children}
        {onClose !== undefined &&
          <CustomIconButton onClick={onClose}>
            <CloseIcon/>
          </CustomIconButton>
        }
      </CustomHiddenLeft>
  )
}

export default LeftMenu
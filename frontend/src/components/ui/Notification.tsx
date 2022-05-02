import React, {useCallback, useEffect, useRef} from "react";
import {styled, Typography, useTheme} from "@mui/material";
import Floater from "./Floater";
import OuterPaper from "./OuterPaper";
import InnerPaper from "./InnerPaper";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  main: string
  secondary?: string
  ok: boolean
  onDone: () => void
}

const CustomFloater = styled(Floater)`
  position: static;
  transition: opacity linear 300ms;
  align-items: end;
`

const CustomOuterPaper = styled(OuterPaper)`
  margin: 0 15px 15px 0;

  width: fit-content;
  height: 0;
  transition: height linear ${({theme}) => theme.transitions.duration.standard}ms;

  cursor: pointer;
`
const CustomInnerPaper = styled(InnerPaper)`
  height: 100%;

  display: flex;
  flex-flow: row;
  justify-content: space-between;
`

const TypographyWrapper = styled("div")`
  display: flex;
  flex-flow: column;
  align-items: baseline;
  justify-content: center;

  max-width: 220px;
`

const Main = styled(Typography)`
  font-size: 0.875rem;
  font-weight: 500;
`

const Secondary = styled(Typography)`
  font-size: 0.67rem;
`

const iconStyle = {
  margin: "auto 0 auto 17px",
}

function Notification({main, secondary = '', onDone, ok}: Props) {
  const floater = useRef<HTMLDivElement>(null!)
  const paper = useRef<HTMLDivElement>(null!)
  const theme = useTheme()
  const removeDelay = theme.transitions.duration.standard
  const time = ok ? 5000 : 15000
  useEffect(() => {
    paper.current.style.height = "60px"
    const timeout = setTimeout(() => {
      floater.current.style.opacity = "0"
      setTimeout(() => onDone(), removeDelay + 100)
    }, time)
    return () => clearTimeout(timeout)
  }, [])
  const onClick = useCallback(() => onDone(), [onDone])
  return (
    <CustomFloater ref={floater} open flow="column" position="bottom-right">
      <CustomOuterPaper ref={paper} elevation={3}>
        <CustomInnerPaper elevation={0} onClick={onClick}>
          <TypographyWrapper>
            <Main>{main}</Main>
            {secondary !== "" && <Secondary>{secondary}</Secondary>}
          </TypographyWrapper>
          {ok && <DoneIcon sx={iconStyle} color="success"/>}
          {!ok && <ErrorOutlineIcon sx={iconStyle} color="error"/>}
        </CustomInnerPaper>
      </CustomOuterPaper>
    </CustomFloater>
  )
}

export default Notification
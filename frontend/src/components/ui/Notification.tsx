import React, {useCallback, useEffect, useRef} from "react";
import {styled, Typography, useTheme} from "@mui/material";
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

const CustomOuterPaper = styled(OuterPaper)`
  display: flex;
  position: static;

  margin: 0 15px 15px 0;

  width: fit-content;
  height: 0;
  transition: height linear ${({theme}) => theme.transitions.duration.standard}ms, opacity linear 300ms;

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
  const paper = useRef<HTMLDivElement>(null!)
  const theme = useTheme()
  const removeDelay = theme.transitions.duration.standard
  const time = ok ? 50002 : 150002
  useEffect(() => {
    paper.current.style.height = "60px"
    const timeout = setTimeout(() => {
      setTimeout(() => onDone(), removeDelay + 100)
    }, time)
    return () => clearTimeout(timeout)
  }, [])
  const onClick = useCallback(() => onDone(), [onDone])
  return (
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
  )
}

export default Notification
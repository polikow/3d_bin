import React, {useCallback, useEffect, useState} from "react";
import {styled, Typography, useTheme} from "@mui/material";
import OuterPaper from "./OuterPaper";
import InnerPaper from "./InnerPaper";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  id: string
  main: string
  secondary?: string
  ok: boolean
  onDone: (id: string) => void
}

const CustomOuterPaper = styled(OuterPaper)<{ step: number }>`
  
  ${({step}) => (step == 1 || step == 3) && "max-height: 0px"};
  ${({step}) => (step == 2) && "max-height: 100px"};
  ${({step}) => (step == 3) ? "opacity: 0" : "opacity: 1"};
  
  ${({step}) => (step == 1 || step == 3) && "margin-bottom: 0px"};
  ${({step}) => (step == 2) && "margin-bottom: 15px"};
  
  display: block;
  position: static;

  margin-top: 0;
  margin-right: 15px; 
  margin-left: 15px;

  width: fit-content;
  transition: all linear ${({theme}) => theme.transitions.duration.standard}ms;

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

const Notification = ({id, main, secondary = '', onDone, ok}: Props) => {
  const [step, setStep] = useState(1)
  const theme = useTheme()
  const removeDelay = theme.transitions.duration.standard
  const time = ok ? 5000 : 15000
  const removeIt = useCallback(
    () => {
      if (step === 3) {
        return
      }
      setStep(3)
      setTimeout(() => onDone(id), removeDelay + 100)
    },
    [step]
  )
  useEffect(() => {
    const removeTimeout = setTimeout(removeIt, time)
    setStep(2)
    return () => clearTimeout(removeTimeout)
  }, [])
  return (
    <CustomOuterPaper step={step} elevation={3}>
      <CustomInnerPaper elevation={0} onClick={removeIt}>
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
import React, {useEffect, useRef} from "react";
import {styled, useTheme} from "@mui/material";
import {useStore} from "../../store/store";

const BarWrapper = styled("div")`
  height: 12px;
  border-radius: 3px;
  background-color: #e0e0e0;
  margin: 7px 0;
  box-shadow: 0px 3px 3px -2px rgb(0 0 0 / 20%);
`

const Bar = styled("div")`
  height: 100%;
  border-radius: 3px;
`

const BarValue = styled("span")`
  float: right;
  position: relative;
  right: 2px;
  font-size: 11px;
`

const ProgressBar = ({index}: { index: number }) => {
  const theme = useTheme()
  const doneColor = theme.palette.success.main
  const workColor = theme.palette.success.light
  const transitionSpeed = theme.transitions.duration.short
  const backgroundColorTransition =
    `background-color ${transitionSpeed}ms linear, width ${transitionSpeed}ms linear`

  const bar = useRef<HTMLDivElement>(null!)
  const value = useRef<HTMLSpanElement>(null!)

  useEffect(() => {
    bar.current.style.transition = backgroundColorTransition

    return useStore.subscribe(
      s => s.searchResult.statuses[index],
      o => {
        if (o === undefined) return
        const {stepsDone, stepsTotal} = o

        if (stepsDone === 0 || stepsDone === 1) {
          bar.current.style.backgroundColor = workColor
        }

        bar.current.style.width = `${stepsDone / stepsTotal * 100}%`
        value.current.textContent = String(stepsDone)

        if (stepsDone === stepsTotal) {
          bar.current.style.backgroundColor = doneColor
        }
      }
    )
  }, [])
  return (
    <BarWrapper>
      <Bar ref={bar}>
        <BarValue ref={value}/>
      </Bar>
    </BarWrapper>
  )
}

export default ProgressBar
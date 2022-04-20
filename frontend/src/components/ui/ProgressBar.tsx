import React from "react";
import {styled} from "@mui/material";

const BarWrapper = styled("div")`
  height: 12px;
  border-radius: 3px;
  background-color: #e0e0e0;
  margin: 7px 0;
`

const Bar = styled("div")<{ percent: number }>`
  width: ${({percent}) => percent}%;
  height: 100%;
  border-radius: 3px;
  background-color: ${
          ({percent, theme}) => percent == 100
                  ? theme.palette.success.main
                  : theme.palette.success.light
  };

  transition: ${({percent}) => percent < 1 ? "none" : `width linear 100ms`};
  transition: background-color linear ${({theme}) => theme.transitions.duration.short}ms;
`

const BarValue = styled("span")`
  float: right;
  position: relative;
  right: 2px;
  font-size: 11px;
`

const ProgressBar = ({stepsDone, stepsTotal}: { stepsDone: number, stepsTotal: number }) => (
  <BarWrapper>
    <Bar percent={stepsDone / stepsTotal * 100}>
      <BarValue>{stepsDone}</BarValue>
    </Bar>
  </BarWrapper>
)

export default ProgressBar
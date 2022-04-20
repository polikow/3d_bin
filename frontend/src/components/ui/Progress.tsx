import React from "react";
import {useStore} from "../../store/store";
import ProgressBar from "./ProgressBar";

const Progress = () => {
  const statuses = useStore(s => s.searchResult.statuses)
  return (
    <>
      {statuses.map(({stepsDone, stepsTotal}, index) => (
        <ProgressBar key={index} stepsDone={stepsDone} stepsTotal={stepsTotal}/>
      ))}
    </>
  )
}

export default Progress
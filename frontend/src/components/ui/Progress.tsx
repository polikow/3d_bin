import React from "react";
import {useStore} from "../../store/store";
import ProgressBar from "./ProgressBar";
import {compareState} from "../../store/compare";

const Progress = () => {
  const statusCount = useStore(s => s.searchResult.statuses.length, compareState)
  return (
    <>
      {Array(statusCount).fill(0).map((_, i) => <ProgressBar key={i} index={i}/>)}
    </>
  )
}

export default Progress
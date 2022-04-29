import React from "react";
import {useStore} from "../../store/store";
import {compareState} from "../../store/compare";
import Fab from "./Fab";
import {Done} from "@mui/icons-material";
import {styled} from "@mui/material";

const Wrapper = styled("div")<{ open: boolean }>`
  opacity: ${({open}) => open ? 1 : 0};

  transition: opacity linear ${({theme}) => theme.transitions.duration.standard}ms;
`

export default ({active, onClick}: { active: boolean, onClick: () => void }) => {
  const solutionFound = useStore(s => s.searchResult.value !== 0, compareState)
  return (
    <Wrapper open={solutionFound}>
      <Fab icon={<Done/>} active={active} disabled={!solutionFound} onClick={onClick}/>
    </Wrapper>
  )
}

import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {styled} from "@mui/material";
import BoldSpan from "./BoldSpan";
import {packing} from "../../wailsjs/go/models";
import TextTypography from "./TextTypography";

const PackedSpan = styled(BoldSpan)`
  margin-top: 3px;
`

const NotPackedSpan = styled(BoldSpan)`
  color: ${props => props.theme.palette.warning.light};
`

function PackingOrder() {
  const packedSpan = useRef<HTMLSpanElement>(null!)
  const notPackedSpan = useRef<HTMLSpanElement>(null!)
  useEffect(() => {
    useStore.subscribe(
      s => [s.searchResult.solution, s.searchResult.packed.length],
      s => {
        const solution = s[0] as packing.IndexRotation[]
        const packedLength = s[1] as number
        packedSpan.current.textContent = success(solution, packedLength)
        notPackedSpan.current.textContent = failed(solution, solution.length - packedLength)
      }
    )
  }, [])
  return (
    <TextTypography>
      Порядок упаковки:
      <br/>
      <PackedSpan ref={packedSpan}/>
      <NotPackedSpan ref={notPackedSpan}/>
    </TextTypography>
  )
}

function success(solution: packing.IndexRotation[], n: number): string {
  return solution.map(({index}) => index + 1).slice(0, n).join(' → ')
}

function failed(solution: packing.IndexRotation[], n: number): string {
  if (n === 0) return ''
  return " → " + solution.map(({index}) => index + 1).slice(-n).join(' → ')
}

export default PackingOrder
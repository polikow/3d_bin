import React from "react";
import {useStore} from "../../store/store";
import {styled} from "@mui/material";
import BoldSpan from "./BoldSpan";
import {IndexRotation} from "../../wailsjs/go/models";
import TextTypography from "./TextTypography";

const PackedSpan = styled(BoldSpan)`
  margin-top: 3px;
`

const NotPackedSpan = styled(BoldSpan)`
  color: ${props => props.theme.palette.warning.light};
`

function PackingOrder() {
  const [solution, packed,] = useStore(s =>
      [s.searchResult.solution, s.searchResult.packed, s.searchResult.value],
    ([, , prevValue], [, , nextValue]) => prevValue === nextValue
  )
  const successfullyPacked = packed.length
  const failedToPackInside = solution.length - packed.length
  return (
    <TextTypography>
      Порядок упаковки:
      <br/>
      <PackedSpan>
        {success(solution, successfullyPacked)}
      </PackedSpan>
      {failedToPackInside !== 0 &&
        <NotPackedSpan>
          {failed(solution, failedToPackInside)}
        </NotPackedSpan>
      }
    </TextTypography>
  )
}

function success(solution: IndexRotation[], n: number): string {
  return solution.map(({index}) => index).slice(0, n).join(' → ')
}

function failed(solution: IndexRotation[], n: number): string {
  return " → " + solution.map(({index}) => index).slice(-n).join(' → ')
}

export default PackingOrder
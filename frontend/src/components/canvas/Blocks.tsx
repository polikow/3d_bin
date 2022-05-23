import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import BlockGroup from "./BlockGroup";
import {colorOf} from "../../utils";
import {packing} from "../../../wailsjs/go/models";

export default () => {
  const ref = useRef<BlockGroup>(null!)
  useEffect(() => {
    useStore.subscribe(
      s => [s.searchResult.solution, s.searchResult.packed],
      s => {
        const solution = s[0] as packing.IndexRotation[]
        const packed = s[1] as packing.BlockPosition[]

        const blockColor = solution.map(o => colorOf(o.index))
        const colorFunc = (i: number) => blockColor[i]

        ref.current.setPositions(packed, colorFunc)
      }, {
        equalityFn: ([prevSolution, prevPacked], [nextSolution, nextPacked]) => {
          return prevSolution === nextSolution && prevPacked === nextPacked
        }
      })
    useStore.subscribe(s => s.transparency, v => ref.current.setTransparency(v))
    useStore.subscribe(s => s.isColorful, v => ref.current.setIsColorful(v))
    useStore.subscribe(s => s.onlyEdges, v => ref.current.setOnlyEdges(v))
  }, [])
  return <primitive
    ref={ref}
    object={BlockGroup.createFrom(useStore.getState().searchResult.packed)}
  />
}
import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import BlockGroup from "./BlockGroup";

export default () => {
  const ref = useRef<BlockGroup>(null!)
  useEffect(() => {
    useStore.subscribe(s => s.searchResult, result => {
      console.log("Blocks positions update")
      ref.current.setPositions(result.packed)
    }, {equalityFn: (a, b) => a.value === b.value})
    useStore.subscribe(s => s.transparency, v => ref.current.setTransparency(v))
    useStore.subscribe(s => s.isColorful, v => ref.current.setIsColorful(v))
    useStore.subscribe(s => s.onlyEdges, v => ref.current.setOnlyEdges(v))
  }, [])
  return <primitive
    ref={ref}
    object={BlockGroup.createFrom(useStore.getState().searchResult.packed)}
  />
}
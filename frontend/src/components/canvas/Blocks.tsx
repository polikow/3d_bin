import React from "react";
import {useStore} from "../../store/store";
import Block from "./Block";
import {colors} from "../../consts";
import {compareStateSlices} from "../../store/compare";

export default () => {
  const [opacity, isColorful, onlyEdges] = useStore(
    s => [s.opacity, s.isColorful, s.onlyEdges],
    compareStateSlices
  )
  const [packed,] = useStore(
    s => [s.searchResult.packed, s.searchResult.value],
    ([, prevValue], [, nextValue]) => prevValue === nextValue
  )

  return (
    <>
      {
        packed.map(({p1, p2}, i) =>
          <Block
            key={i} p1={p1} p2={p2}
            gap={onlyEdges}
            color={isColorful ? colors[i % colors.length] : "grey"}
            opacity={1 - opacity}
            onlyEdges={onlyEdges}
          />
        )
      }
    </>
  );
}
import React from "react";
import {useStore} from "../../store/store";
import {BlockPosition} from "../../types";
import Block from "./Block";

const colors =
  ["violet", "indigo", "blue", "green", "yellow", "orange", "red"].reverse()

export default () => {
  const [packed, opacity, isColorful, onlyEdges] = useStore(s =>
    [s.packed, s.opacity, s.isColorful, s.onlyEdges]
  )

  return (
    <>
      {
        packed.map(({p1, p2}: BlockPosition, i: number) =>
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
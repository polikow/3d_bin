import React from "react";
import {useStore} from "../../store/store";
import Block from "./Block";
import {colors} from "../../consts";

export default () => {
  const [packed, opacity, isColorful, onlyEdges] = useStore(s =>
    [s.searchResult.packed, s.opacity, s.isColorful, s.onlyEdges]
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
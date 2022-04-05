import React, {useEffect} from "react";
import {useStore} from "../../store/store";
import BlockComponent from "./Block";
import Label from "./Label";
import {colors, gap} from "../../consts";

export default function () {
  const [opacity, isColorful, onlyEdges, cargo, space] = useStore(
    s => [s.opacity, s.isColorful, s.onlyEdges, s.cargo, s.space])

  useEffect(() => console.log("cargo ui render"))

  const scale = 30 + Math.floor(30 * space[1] * 0.34)
  return (
    <>
      {
        cargo.map(({p1, p2}, i) => (
            <React.Fragment key={i}>
              <Label
                text={i + 1}
                position={[p2.x - (p2.x - p1.x) / 2, 0, p1.z - gap / 2]}
                scale={scale}/>
              <BlockComponent
                p1={p1} p2={p2}
                gap={onlyEdges}
                color={isColorful ? colors[i % colors.length] : "grey"}
                opacity={1 - opacity}
                onlyEdges={onlyEdges}/>
            </React.Fragment>
          )
        )
      }
    </>
  )
}


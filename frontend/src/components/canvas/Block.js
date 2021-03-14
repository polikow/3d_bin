import React from "react";
import BlockFilled from "./BlockFilled";
import BlockEdges from "./BlockEdges";

const sShift = 0.015
const pShift = sShift / 2

export default ({p1, p2, color, opacity, onlyEdges = true, gap = false}) => {
  const s = gap
    ? [p2.x - p1.x - sShift, p2.y - p1.y - sShift, p2.z - p1.z - sShift]
    : [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z]

  const p = gap
    ? [p1.x + s[0] / 2 + pShift, p1.y + s[1] / 2 + pShift, p1.z + s[2] / 2 + pShift]
    : [p1.x + s[0] / 2, p1.y + s[1] / 2, p1.z + s[2] / 2]

  return onlyEdges
    ? <BlockEdges position={p} size={s} opacity={opacity} color={color}/>
    : <BlockFilled position={p} size={s} opacity={opacity} color={color}/>
}
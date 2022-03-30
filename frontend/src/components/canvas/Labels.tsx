import React from "react";
import {useStore} from "../../store/store";
import {Block} from "../../wailsjs/go/models"
import Label from "./Label";

const maxLabelsPerAxis = 10
const s = -0.1  // shift from the axis

export default ({w, h, l}: Block) => {
  const labelScale = useStore((s: { labelScale: any; }) => s.labelScale)
  const scale = labelScale + Math.floor(labelScale * Math.max(w, h, l) * 0.2)

  return (
      <>
        <Label text={0} position={[s, 0, s]} scale={scale}/>
        {labels(w).map(i => <Label key={i} text={i} position={[i, 0, s]} scale={scale}/>)}
        {labels(h).map(i => <Label key={i} text={i} position={[s, i, s]} scale={scale}/>)}
        {labels(l).map(i => <Label key={i} text={i} position={[s, 0, i]} scale={scale}/>)}
      </>
  )
}

function labels(axisSize: number) {
  if (axisSize <= maxLabelsPerAxis) {
    return arrayN(axisSize)
  } else {
    const step = Math.floor(axisSize / maxLabelsPerAxis)
    let res = arrayN(maxLabelsPerAxis).map(value => value * step)
    if (res[maxLabelsPerAxis - 1] !== axisSize)
      res.push(axisSize)
    return res
  }
}

function arrayN(n: number) {
  let a = new Array(n)
  for (let i = 0; i < a.length; i++) {
    a[i] = i + 1
  }
  return a
}

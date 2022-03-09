import React from "react";
import {useStore} from "../../store";
import {arrayN} from "../../utils";
import Label from "./Label";

const maxLabelsPerAxis = 10
const s = -0.1  // shift from the axis


function labels(axisSize) {
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

export default ({w, h, l}) => {
  const labelScale = useStore(s => s.labelScale)
  const scale = labelScale + Math.floor(labelScale * Math.max(w, h, l) * 0.2)

  return <> <Label text={0} position={[s, 0, s]} scale={scale}/>
    {labels(w).map(i => <Label key={i} text={i} position={[i, 0, s]} scale={scale}/>)}
    {labels(h).map(i => <Label key={i} text={i} position={[s, i, s]} scale={scale}/>)}
    {labels(l).map(i => <Label key={i} text={i} position={[s, 0, i]} scale={scale}/>)}
  </>
}

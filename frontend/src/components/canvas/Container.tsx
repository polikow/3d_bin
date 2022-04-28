import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {BlockPosition} from "../../wailsjs/go/models"
import Block from "./Block";
import Grids from "./Grids";

const c = useStore.getState().container

const containerBlockObj = new Block(
  new BlockPosition({p1: {x: 0, y: 0, z: 0}, p2: {x: c.w, y: c.h, z: c.l}}),
  0xffffff, true, 0, false
)
const gridsObj = new Grids(c)

export default () => {
  const containerBlock = useRef<Block>(null!)
  const grids = useRef<Grids>(null!)
  useEffect(() => {
    useStore.subscribe(
      s => s.container,
      c => {
        containerBlock.current.setPositionAndScaleFromWHL(c)
        grids.current.setDimensions(c)
      }
    )
    useStore.subscribe(s => s.isGridVisible, v => grids.current.visible = v)
  }, [])
  return (
    <group>
      <primitive ref={containerBlock} object={containerBlockObj}/>
      <primitive ref={grids} object={gridsObj}/>
    </group>
  )
}

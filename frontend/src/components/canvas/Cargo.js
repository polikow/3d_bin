import React, {useEffect} from "react";
import {useStore} from "../../store";
import Block from "./Block";
import {objCenter, objPositionForCargo} from "../../utils";

const colors =
  ["violet", "indigo", "blue", "green", "yellow", "orange", "red"].reverse()

const blocksPerRow = 5
const gap = 2

export default function () {
  useEffect(() => console.log("cargo render"))

  const [blocks, opacity, isColorful, onlyEdges,
    hasGaps, updateCargoSceneCamera] = useStore(
    s => [s.blocks, s.opacity, s.isColorful, s.onlyEdges,
      s.hasGaps, s.updateCargoSceneCamera])

  const space = spaceForOneBlock(blocks)
  const cargo = findBlocksPositions(blocks, space)
  const bound = boundingRect(blocks, space)

  useEffect(() => {
      const position = objPositionForCargo(bound)
      const target = objCenter(bound);
      updateCargoSceneCamera(position, target)
    }, [bound[0], bound[1], bound[2]]
  ) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    cargo.map(({p1, p2}, i) => (
        <Block key={i} p1={p1} p2={p2}
               gap={hasGaps}
               color={isColorful ? colors[i % colors.length] : "grey"}
               opacity={1 - opacity}
               onlyEdges={onlyEdges}/>
      )
    )
  )
}

function spaceForOneBlock(blocks) {
  let xSpace = 0
  let ySpace = 0
  let zSpace = 0

  for (let i = 0; i < blocks.length; i++) {
    const [x, y, z] = blocks[i]
    if (x > xSpace) {
      xSpace = x
    }
    if (y > ySpace) {
      ySpace = y
    }
    if (z > zSpace) {
      zSpace = z
    }
  }

  return [xSpace, ySpace, zSpace]
}

function findBlocksPositions(blocks) {
  const [xSpace, , zSpace] = spaceForOneBlock(blocks)

  return blocks.map((block, i) => {
    const row = Math.floor(i / blocksPerRow)
    const col = i % blocksPerRow
    const xShift = col * (xSpace + gap)
    const zShift = row * (zSpace + gap)
    // console.log(`${i} block: row = ${row}, col = ${col}`)
    return blockPosition(block, xSpace, zSpace, xShift, zShift)
  })
}

function blockPosition(block, xSpace, zSpace, xShift, zShift) {
  const [w, h, l] = block
  const xSpaceShift = (xSpace - w) / 2
  const zSpaceShift = (zSpace - l) / 2
  return {
    p1: {
      x: xSpaceShift + xShift,
      y: 0,
      z: zSpaceShift + zShift,
    },
    p2: {
      x: w + xSpaceShift + xShift,
      y: h,
      z: l + zSpaceShift + zShift
    }
  }
}

function boundingRect(blocks, space) {
  let [xSpace, ySpace, zSpace] = space

  //всего необходимо строк
  let rows = Math.ceil(blocks.length / blocksPerRow)
  let gapsBetweenCols = blocksPerRow - 1
  let gapsBetweenRows = rows - 1

  let x = xSpace * blocksPerRow + gapsBetweenCols * gap
  let y = ySpace
  let z = zSpace * rows + gapsBetweenRows * gap

  return [x, y, z]
}


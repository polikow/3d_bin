import * as THREE from "three";
import {defaultColor} from "../../consts";
import {packing} from "../../../wailsjs/go/models";
import {colorOf} from "../../utils";

const filledGeometry = new THREE.BoxBufferGeometry()
const filledMaterial = new THREE.MeshStandardMaterial({transparent: true})

const edgesGeometry = new THREE.EdgesGeometry(filledGeometry)
const edgesMaterial = new THREE.LineBasicMaterial({transparent: true})

class Block extends THREE.Group {

  static DEFAULT_COLOR = new THREE.Color(defaultColor)

  readonly filled
  readonly edges

  onlyEdges = false
  transparency = 0.4
  color = Block.DEFAULT_COLOR
  isColorful = true

  constructor(
    bp: packing.BlockPosition,
    color: THREE.ColorRepresentation,
    onlyEdges: boolean,
    transparency: number,
    isColorful: boolean
  ) {
    super()
    this.filled = new THREE.Mesh(filledGeometry, filledMaterial.clone())
    this.edges = new THREE.LineSegments(edgesGeometry, edgesMaterial.clone())
    this.add(this.filled, this.edges)
    this.setPositionAndScaleFromBP(bp)
    this.setColor(color, true)
    this.setOnlyEdges(onlyEdges)
    this.setTransparency(transparency)
    this.setIsColorful(isColorful)
  }

  setOnlyEdges(onlyEdges: boolean) {
    this.onlyEdges = onlyEdges
    this.edges.visible = this.onlyEdges
    this.filled.visible = !this.onlyEdges
  }

  setIsColorful(isColorful: boolean) {
    this.isColorful = isColorful
    if (this.isColorful) {
      this.edges.material.color = this.color
      this.filled.material.color = this.color
    } else {
      this.edges.material.color = Block.DEFAULT_COLOR
      this.filled.material.color = Block.DEFAULT_COLOR
    }
  }

  setColor(color: THREE.ColorRepresentation, initialization = false) {
    this.color = new THREE.Color(color)
    if (!this.isColorful && !initialization) return
    this.edges.material.color = this.color
    this.filled.material.color = this.color
  }

  setTransparency(transparency: number) {
    this.transparency = transparency
    this.edges.material.opacity = 1 - transparency
    this.filled.material.opacity = 1 - transparency
  }

  setPositionAndScaleFromWHL({w, h, l}: { w: number, h: number, l: number }) {
    this.setPositionAndScaleFromTuple([w / 2, h / 2, l / 2], [w, h, l])
  }

  setPositionAndScaleFromBP(bp: packing.BlockPosition) {
    const sShift = 0.015
    const pShift = sShift / 2

    const {p1, p2} = bp
    const withGap = this.onlyEdges

    const s: [number, number, number] = withGap
      ? [p2.x - p1.x - sShift, p2.y - p1.y - sShift, p2.z - p1.z - sShift]
      : [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z]

    const p: [number, number, number] = withGap
      ? [p1.x + s[0] / 2 + pShift, p1.y + s[1] / 2 + pShift, p1.z + s[2] / 2 + pShift]
      : [p1.x + s[0] / 2, p1.y + s[1] / 2, p1.z + s[2] / 2]

    this.setPositionAndScaleFromTuple(p, s)
  }

  setPositionAndScaleFromTuple(position: [number, number, number], scale: [number, number, number]) {
    this.position.set(...position)
    this.scale.set(...scale)
  }

  static setTransparency(blocks: Block[], transparency: number) {
    for (const block of blocks) block.setTransparency(transparency)
  }

  static setIsColorful(blocks: Block[], isColorful: boolean) {
    for (const block of blocks) block.setIsColorful(isColorful)
  }

  static setOnlyEdges(blocks: Block[], onlyEdges: boolean) {
    for (const block of blocks) block.setOnlyEdges(onlyEdges)
  }

  static createFrom(bps: packing.BlockPosition[], onlyEdges: boolean, transparency: number, isColorful: boolean): Block[] {
    return bps.map((bp, i) =>
      new Block(bp, colorOf(i), onlyEdges, transparency, isColorful))
  }
}

export default Block
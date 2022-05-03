import * as THREE from "three";
import Grid from "./Grid";
import {packing} from "../../wailsjs/go/models";

class Grids extends THREE.Group {

  static readonly COLOR = 0x999999

  private readonly xy: Grid
  private readonly xz: Grid
  private readonly yz: Grid
  private readonly xyOpposite: Grid
  private readonly xzOpposite: Grid
  private readonly yzOpposite: Grid

  constructor({w, h, l}: packing.Block | packing.Container, cellSize: number = 1) {
    const c = Grids.COLOR;
    super();
    this.xy = new Grid(w, h, cellSize, c)
    this.xz = new Grid(w, l, cellSize, c).rotateX(Math.PI / 2)
    this.yz = new Grid(l, h, cellSize, c).rotateY(-Math.PI / 2)
    this.xyOpposite = new Grid(w, h, cellSize, c)
    this.xzOpposite = new Grid(w, l, cellSize, c).rotateX(Math.PI / 2)
    this.yzOpposite = new Grid(l, h, cellSize, c).rotateY(-Math.PI / 2)
    this.setSideVisibility()
    this.translate(w, h, l)
    this.add(
      this.xy, this.xz, this.yz,
      this.xyOpposite, this.xzOpposite, this.yzOpposite
    )
  }

  setDimensions({w, h, l}: packing.Block | packing.Container, f: (d: number) => number) {
    this.xy.setSize(w, h).setCellSize(this.cellSizeForPlane(w, h, f))
    this.yz.setSize(l, h).setCellSize(this.cellSizeForPlane(l, h, f))
    this.xz.setSize(w, l).setCellSize(this.cellSizeForPlane(w, l, f))
    this.xyOpposite.setSize(w, h).setCellSize(this.cellSizeForPlane(w, h, f))
    this.xzOpposite.setSize(w, l).setCellSize(this.cellSizeForPlane(w, l, f))
    this.yzOpposite.setSize(l, h).setCellSize(this.cellSizeForPlane(l, h, f))
    this.translate(w, h, l)
  }

  cellSizeForPlane(a:number, b: number, f: (d: number) => number) {
    return Math.max(f(a), f(b))
  }

  private setSideVisibility() {
    (this.xy.material as THREE.Material).side = THREE.FrontSide;
    (this.xz.material as THREE.Material).side = THREE.BackSide;
    (this.yz.material as THREE.Material).side = THREE.BackSide;
    (this.xyOpposite.material as THREE.Material).side = THREE.BackSide;
    (this.xzOpposite.material as THREE.Material).side = THREE.FrontSide;
    (this.yzOpposite.material as THREE.Material).side = THREE.FrontSide;
  }

  private translate(w: number, h: number, l: number) {
    this.undoPreviousTranslates()
    this.xy.translateX(w / 2).translateY(h / 2)
    this.xz.translateX(w / 2).translateY(l / 2)
    this.yz.translateX(l / 2).translateY(h / 2)
    this.xyOpposite.translateX(w / 2).translateY(h / 2).translateZ(l)
    this.xzOpposite.translateX(w / 2).translateY(l / 2).translateZ(-h)
    this.yzOpposite.translateX(l / 2).translateY(h / 2).translateZ(-w)
  }

  private undoPreviousTranslates() {
    for (const grid of (this.children as Grid[])) {
      grid.position.set(0, 0, 0)
    }
  }
}

export default Grids
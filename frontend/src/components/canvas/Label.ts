// @ts-nocheck
import {preloadFont, Text} from 'troika-three-text'
import * as THREE from "three"
import {packing} from "../../wailsjs/go/models"

type AllowedCharacter = number | 'x' | 'y' | 'z' | ''

class Label extends Text {

  // TODO change FONT path
  static readonly FONT = 'media/roboto-v29-latin_cyrillic-regular.90fc8764.woff'
  static readonly CHARACTERS = '-0123456789xyz'
  static readonly COLOR: THREE.ColorRepresentation = 0x000000
  static readonly DISTANCE_FACTOR = 0.027
  static readonly AXIS_SHIFT_FACTOR = 0.07
  static readonly AXIS_SHIFT_BIAS = 0.1
  static readonly HIDDEN_POSITION = new THREE.Vector3()

  private _content
  get content() {
    return this._content
  }
  set content(value: AllowedCharacter) {
    this._content = typeof value === "string" ? value : String(Math.floor(value))
    this.text = this.content
    if (this._content === '') {
      this.position.copy(Label.HIDDEN_POSITION)
    }
  }

  constructor(value: AllowedCharacter = 1, color = Label.COLOR, fontSize = 1) {
    super()
    this.font = Label.FONT
    this.anchorX = "center"
    this.anchorY = "middle"

    this.content = value
    this.fontSize = fontSize
    this.color = color
  }

  followCamera(camera: THREE.Camera) {
    this.lookAt(camera.position)

    const d = camera.position.distanceTo(this.position) * Label.DISTANCE_FACTOR
    this.scale.set(d, d, d)
  }

  positionAtCenterOfX(o: packing.Container | packing.Block): Label {
    this.position.set(o.w / 3, 0, Label.axisShift(o))
    return this
  }

  positionAtCenterOfY(o: packing.Container | packing.Block): Label {
    this.position.set(Label.axisShift(o), o.h / 3, Label.axisShift(o))
    return this
  }

  positionAtCenterOfZ(o: packing.Container | packing.Block): Label {
    this.position.set(Label.axisShift(o), 0, o.l / 3)
    return this
  }

  private static axisShift({w, h, l}: packing.Container | packing.Block) {
    return -((w + h + l) / 3 * Label.AXIS_SHIFT_FACTOR + Label.AXIS_SHIFT_BIAS)
  }

  private static smallAxisShift(o: packing.Container | packing.Block) {
    return Label.axisShift(o) + 0.05
  }

  positionAtCornerOf(o: packing.Container | packing.Block): Label {
    const s = Label.smallAxisShift(o)
    this.position.set(s, 0, s)
    return this
  }

  positionAtXOf(x: number, o: packing.Container | packing.Block) {
    const s = Label.smallAxisShift(o)
    this.position.set(x, 0, s)
  }

  positionAtYOf(y: number, o: packing.Container | packing.Block) {
    const s = Label.smallAxisShift(o)
    this.position.set(s, y, s)
  }

  positionAtZOf(z: number, o: packing.Container | packing.Block) {
    const s = Label.smallAxisShift(o)
    this.position.set(s, 0, z)
  }
}

preloadFont({font: Label.FONT, characters: Label.CHARACTERS}, console.log)

export default Label
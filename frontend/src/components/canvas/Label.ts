// @ts-nocheck
import {preloadFont, Text} from 'troika-three-text'
import * as THREE from "three"
import {Block, Container} from "../../wailsjs/go/models"

type AllowedCharacter = number | 'x' | 'y' | 'z' | ''

class Label extends Text {

  // TODO change FONT path
  static readonly FONT = 'media/roboto-v29-latin_cyrillic-regular.90fc8764.woff'
  static readonly CHARACTERS = '-0123456789xyz'
  static readonly COLOR: THREE.ColorRepresentation = 0x000000
  static readonly DISTANCE_FACTOR = 0.027
  static readonly AXIS_SHIFT_FACTOR = 0.07
  static readonly AXIS_SHIFT_BIAS = 0.1

  readonly content

  constructor(value: AllowedCharacter = 1, color = Label.COLOR, fontSize = 1) {
    super()
    this.font = Label.FONT
    this.anchorX = "center"
    this.anchorY = "middle"

    this.text = typeof value === "string" ? value : String(Math.floor(value))
    this.fontSize = fontSize
    this.color = color

    this.content = this.text
  }

  followCamera(camera: THREE.Camera) {
    this.lookAt(camera.position)

    const d = camera.position.distanceTo(this.position) * Label.DISTANCE_FACTOR
    this.scale.set(d, d, d)
  }

  positionAtCenterOfX(o: Container | Block): Label {
    this.position.set(o.w / 3, 0, Label.axisShift(o))
    return this
  }

  positionAtCenterOfY(o: Container | Block): Label {
    this.position.set(Label.axisShift(o), o.h / 3, Label.axisShift(o))
    return this
  }

  positionAtCenterOfZ(o: Container | Block): Label {
    this.position.set(Label.axisShift(o), 0, o.l / 3)
    return this
  }

  private static axisShift({w, h, l}: Container | Block) {
    return -((w + h + l) / 3 * Label.AXIS_SHIFT_FACTOR + Label.AXIS_SHIFT_BIAS)
  }
}

preloadFont({font: Label.FONT, characters: Label.CHARACTERS}, console.log)

export default Label
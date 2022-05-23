import {useStore} from "../../store/store";
import Block from "./Block";
import {packing} from "../../../wailsjs/go/models";
import {colorOf} from "../../utils";
import * as THREE from "three";

class BlockGroup extends THREE.Group {

  static createFrom(positions: packing.BlockPosition[]) {
    const {transparency, isColorful, onlyEdges} = useStore.getState()
    const instance = new BlockGroup
    instance.add(...Block.createFrom(positions, onlyEdges, transparency, isColorful))
    return instance
  }

  protected get blocks() {
    return this.children as Block[]
  }

  setPositions(positions: packing.BlockPosition[], colorFunc = colorOf) {
    const source = (this.blocks[0] === undefined) ? useStore.getState(): this.blocks[0]
    const {transparency, isColorful, onlyEdges} = source

    const blocks = this.blocks
    const blocksToUpdate = positions.length - (Math.max(positions.length - blocks.length, 0))

    // удаляем лишние грузы
    while (positions.length < blocks.length) {
      blocks.pop()!.removeFromParent()
    }
    // добавляем недостающие грузы
    while (positions.length > blocks.length) {
      const i = blocks.length
      const bp = positions[i];
      const color = colorFunc(i);
      const block = new Block(bp, color, onlyEdges, transparency, isColorful)
      this.add(block)
    }
    // обновляем их положение и размер
    for (let i = 0; i < blocksToUpdate; i++) {
      blocks[i].setPositionAndScaleFromBP(positions[i])
    }
  }

  setTransparency(transparency: number) {
    Block.setTransparency(this.blocks, transparency)
  }

  setIsColorful(isColorful: boolean) {
    Block.setIsColorful(this.blocks, isColorful)
  }

  setOnlyEdges(onlyEdges: boolean) {
    Block.setOnlyEdges(this.blocks, onlyEdges)
  }
}

export default BlockGroup
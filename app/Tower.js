import * as THREE from 'three';
import Block from './Block'

class Tower {
  constructor (blockSize, colors, towerWidth, towerHeight) {
    const now = performance.now()
    this.delta = now
    this.gamma = now
    this.beta = now
    this.alpha = now + 500
    this.blocks = []
    this.group = new THREE.Object3D()

    for (let x = 0; x < towerWidth; x ++) {
      for (let y = 0; y < towerWidth; y ++) {
        for (let z = 0; z < towerHeight; z ++) {
          if (Math.random() > 0.5) {
            const newBlock = new Block(x, y, z, blockSize, colors, towerWidth, towerHeight)
            this.group.add(newBlock.group)
            this.blocks.push(newBlock)
          }
        }
      }
    }
  }

  update (now) {
    const blocks = this.blocks

    if (now > this.delta + 1000) {
      for (let i = 0; i < blocks.length; i ++) {
          blocks[i].move(blocks)
      }
      this.delta = now
    }

    if (now > this.alpha + 1000) {
      for (let i = 0; i < blocks.length; i ++) {
          blocks[i].shapeShift()
      }
      this.alpha = now
    }

    for (let i = 0; i < blocks.length; i ++) {
      blocks[i].update()
    }
  }
}

export default Tower

import * as THREE from 'three'
import Block from './Block'
import Pipes from './Pipes'
import Events from './Events'

class Tower {
  constructor (blockSize, colors, towerWidth, towerHeight, startPos) {
    const now = Date.now()
    const pipes = new Pipes(blockSize, towerHeight)
    this.delta = now
    this.gamma = now
    this.beta = now
    this.alpha = now + 500
    this.blocks = []
    this.group = new THREE.Object3D()
    this.group.position.z = startPos
    this.maxZ = towerHeight * blockSize
    this.minZ = -this.maxZ
    this.group.add(pipes.group)

    for (let x = 0; x < towerWidth; x++) {
      for (let y = 0; y < towerWidth; y++) {
        for (let z = 0; z < towerHeight - 2; z++) {
          if (Math.random() > 0.5 && !(x === 2 && y === 2)) {
            const newBlock = new Block(x, y, z, blockSize, colors, towerWidth, towerHeight)
            this.group.add(newBlock.group)
            this.blocks.push(newBlock)
          }
        }
      }
    }

    Events.emitter.on('clap', () => {
      for (let i = 0; i < this.blocks.length; i++) {
        this.blocks[i].move(this.blocks)
      }
    })

    Events.emitter.on('funky-hat', () => {
      for (let i = 0; i < this.blocks.length; i++) {
        this.blocks[i].flash(true)
      }
    })
  }

  update (time) {
    const blocks = this.blocks

    this.group.position.z += 5

    if (this.group.position.z > this.maxZ) {
      this.group.position.z = this.minZ
    }

    // if (now > this.alpha + 1000) {
    //   for (let i = 0; i < blocks.length; i ++) {
    //       blocks[i].shapeShift()
    //   }
    //   this.alpha = now
    // }

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].update(time)
    }
  }
}

export default Tower

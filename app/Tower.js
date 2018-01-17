import TWEEN from '@tweenjs/tween.js'

import * as THREE from 'three'
import Block from './Block'
import Pipes from './Pipes'
import Events from './Events'
import * as c from './constants'

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
    this.tower = new THREE.Object3D()
    this.group.add(this.tower)
    this.group.add(pipes.group)
    this.props = {
      scale: 1,
      speed: 5
    }

    for (let x = 0; x < towerWidth; x++) {
      for (let y = 0; y < towerWidth; y++) {
        for (let z = 0; z < towerHeight - 2; z++) {
          if (Math.random() > 0.5 && !(x === 2 && y === 2)) {
            const newBlock = new Block(x, y, z, blockSize, colors, towerWidth, towerHeight)
            this.tower.add(newBlock.group)
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

    Events.emitter.on('prog-2', () => {
      this.changeSpeed(20, c.barTime)
    })

    Events.emitter.on('prog-4', () => {
      this.changeScale(5, c.barTime * 12)
    })
  }

  changeScale (scale, duration) {
    new TWEEN.Tween(this.props)
      .to({ scale }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
  }

  changeSpeed (speed, duration) {
    new TWEEN.Tween(this.props)
      .to({ speed: speed }, duration)
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
  }

  flicker () {
    const numFlicks = 5
    let i = 0
    const flick = () => {
      if (i > numFlicks) {
        this.group.visible = true
      } else {
        this.group.visible = !this.group.visible
        setTimeout(flick, Math.random() * 50)
        i++
      }
    }

    flick()
  }

  update (time) {
    const blocks = this.blocks

    this.group.position.z += this.props.speed

    if (this.group.position.z > this.maxZ) {
      this.group.position.z = this.minZ
      this.flicker()
    }

    this.tower.scale.set(this.props.scale, this.props.scale, 1)

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].update(time)
    }
  }
}

export default Tower

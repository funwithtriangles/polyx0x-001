import TWEEN from '@tweenjs/tween.js'

import { Object3D, ShaderMaterial, Color } from 'three'
import Block from './Block'
import Pipes from './Pipes'
import Events from './Events'
import * as c from './constants'

import vertShader from './vert.glsl'
import fragShader from './frag.glsl'

class Tower {
  constructor (blockSize, colors, towerWidth, towerHeight, startPos) {
    const now = Date.now()
    this.pipes = new Pipes(blockSize, towerHeight)
    const numWavyMats = 5
    this.delta = now
    this.gamma = now
    this.beta = now
    this.alpha = now + 500
    this.blocks = []
    this.group = new Object3D()
    this.group.position.z = startPos
    this.maxZ = towerHeight * blockSize
    this.minZ = -this.maxZ
    this.tower = new Object3D()
    this.group.add(this.tower)
    this.group.add(this.pipes.group)
    this.props = {
      scale: 1,
      speed: 5
    }

    this.wavyMats = []

    for (let i = 0; i < numWavyMats; i++) {
      const mat = new ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        uniforms: {
          iTime: { value: Date.now(), type: 'f' },
          seed: { value: Math.random() * 100 },
          color1: { value: new Color(colors[0]) },
          color2: { value: new Color(0x2EFFFD) }
        }
      })

      this.wavyMats.push(mat)
    }

    for (let x = 0; x < towerWidth; x++) {
      for (let y = 0; y < towerWidth; y++) {
        for (let z = 0; z < towerHeight - 2; z++) {
          if (Math.random() > 0.5 && !(x === 2 && y === 2)) {
            const newBlock = new Block(x, y, z, blockSize, colors, towerWidth, towerHeight, this.wavyMats)
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
      this.changeSpeed(15, c.barTime)
    })

    Events.emitter.on('prog-3', () => {
      this.isRemoving = true
    })

    Events.emitter.on('bar', () => {
      if (this.isRemoving) {
        this.removeBlocks()
      } else {
        this.addBlocks()
      }
    })

    Events.emitter.on('prog-4', () => {
      this.changeScale(10, c.barTime * 16)
    })

    Events.emitter.on('prog-5', () => {
      this.changeSpeed(1, c.barTime * 8)
      this.isRemoving = false
    })

    Events.emitter.on('prog-6', () => {
      this.changeSpeed(30, c.beatTime)
    })

    Events.emitter.on('drop', () => {
      this.changeScale(1, c.beatTime, TWEEN.Easing.Elastic.Out)
    })

    this.isPulsing = false
  }

  changeScale (scale, duration, tween) {
    this.isPulsing = false
    new TWEEN.Tween(this.props)
      .to({ scale }, duration)
      .easing(tween || TWEEN.Easing.Quadratic.In)
      .start()
  }

  changeSpeed (speed, duration, tween) {
    new TWEEN.Tween(this.props)
      .to({ speed: speed }, duration)
      .easing(tween || TWEEN.Easing.Quadratic.In)
      .start()
  }

  startPulsing () {
    this.isPulsing = true
  }

  removeBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      if (Math.random() > 0.8) {
        this.blocks[i].group.visible = false
      }
    }
  }

  addBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      if (Math.random() > 0.8) {
        this.blocks[i].group.visible = true
      }
    }
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

  update (time, delta) {
    const blocks = this.blocks

    this.group.position.z += (this.props.speed * delta)

    if (this.group.position.z > this.maxZ) {
      this.group.position.z = this.minZ
      this.flicker()
    }

    if (this.isPulsing === true) {
      this.props.scale = (Math.sin(time / 1000) * 5) + 6
    }

    this.tower.scale.set(this.props.scale, this.props.scale, 1)

    this.pipes.update(time)

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].update(time)
    }

    for (let i = 0; i < this.wavyMats.length; i++) {
      this.wavyMats[i].uniforms.iTime.value = time
    }
  }
}

export default Tower

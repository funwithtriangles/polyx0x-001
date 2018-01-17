import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import Pipe from './Pipe'
import Events from './Events'
import * as c from './constants'

class Pipes {
  constructor (blockSize, towerHeight) {
    this.pipes = []
    this.numPipes = 3
    this.group = new THREE.Object3D()

    for (let i = 0; i < this.numPipes; i++) {
      const pipe = new Pipe(blockSize, towerHeight)
      this.pipes.push(pipe)
      this.group.add(pipe.group)
    }

    this.flicker()

    Events.emitter.on('quarter-beat', () => {
      this.flicker()
    })
  }

  flicker () {
    const randomIndex = Math.floor(Math.random() * this.numPipes)
    for (let i = 0; i < this.numPipes; i++) {
      const pipe = this.pipes[i]
      if (randomIndex === i) {
        pipe.group.visible = true
      } else {
        pipe.group.visible = false
      }
    }
  }
}

export default Pipes

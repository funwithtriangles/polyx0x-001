import { Object3D } from 'three'
import Pipe from './Pipe'
import Events from './Events'

class Pipes {
  constructor (blockSize, towerHeight) {
    this.pipes = []
    this.numPipes = 3
    this.group = new Object3D()

    for (let i = 0; i < this.numPipes; i++) {
      const pipe = new Pipe(blockSize, towerHeight)
      this.pipes.push(pipe)
      this.group.add(pipe.group)
    }

    this.flicker()
    this.isFlickering = Math.random() > 0.9

    Events.emitter.on('16-beat', () => {
      this.flicker()
    })

    this.isRotating = false

    Events.emitter.on('prog-5', () => {
      this.isRotating = true
    })
  }

  flicker () {
    if (this.isFlickering) {
      const randomIndex = Math.floor(Math.random() * this.numPipes)
      for (let i = 0; i < this.numPipes; i++) {
        const pipe = this.pipes[i]
        if (randomIndex === i) {
          pipe.group.visible = true
        } else {
          pipe.group.visible = false
        }
      }
      this.isFlickering = Math.random() < 0.9
    } else {
      this.isFlickering = Math.random() > 0.9
    }
  }

  update () {
    if (this.isRotating) {
      this.group.rotation.z -= 0.015
    }
  }
}

export default Pipes

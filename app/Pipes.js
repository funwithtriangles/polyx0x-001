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
    this.mode = 'flicker'

    Events.emitter.on('16-beat', () => {
      this.flicker()
    })

    this.isRotating = false

    Events.emitter.on('prog-5', () => {
      this.isRotating = true
    })

    Events.emitter.on('claps-back', () => {
      this.mode = 'swap'
      this.swap()
    })

    Events.emitter.on('claps-fade', () => {
      this.mode = false
    })

    Events.emitter.on('prog-6', () => {
      this.isFlickeringMaster = true
    })

    Events.emitter.on('clap', () => {
      if (this.mode === 'swap') {
        this.swap()
      }
    })
  }

  randomPipeIndex () {
    return Math.floor(Math.random() * this.numPipes)
  }

  flicker () {
    if (this.mode === 'flicker') {
      if (this.isFlickering) {
        const randomIndex = this.randomPipeIndex()
        this.visiblePipe = randomIndex
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
  }

  swap () {
    let randomIndex
    const r = () => {
      randomIndex = this.randomPipeIndex()
      if (randomIndex === this.visiblePipe) r()
    }
    r()
    this.visiblePipe = randomIndex
    for (let i = 0; i < this.numPipes; i++) {
      const pipe = this.pipes[i]
      if (randomIndex === i) {
        pipe.group.visible = true
      } else {
        pipe.group.visible = false
      }
    }
  }

  update () {
    if (this.isRotating) {
      this.group.rotation.z -= 0.015
    }
  }
}

export default Pipes

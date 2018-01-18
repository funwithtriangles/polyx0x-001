import { EventEmitter } from 'events'
import { audio } from './Controls'
import * as c from './constants'
let allBeatCount = 1
let beatCount = 1
let barCount = 1
let qBeatCount = 1
let allQBeatCount = 1
let all16BeatCount = 1
const beatTime = c.beatTime / 1000
let isClapping = false

class Events {
  constructor () {
    this.delta = audio.currentTime - beatTime
    this.emitter = new EventEmitter()
  }

  update () {
    const time = audio.currentTime
    const current16Beat = Math.floor(time / (beatTime / 16)) + 16
    const currentQBeat = Math.floor(time / (beatTime / 4)) + 4
    const currentBeat = Math.floor(time / beatTime) + 1

    if (allBeatCount === 2) {
      this.emitter.emit('start')
    }

    if (current16Beat > all16BeatCount) {
      this.emitter.emit('16-beat')
      all16BeatCount = current16Beat
    }

    if (currentQBeat > allQBeatCount) {
      qBeatCount++
      allQBeatCount = currentQBeat

      if (qBeatCount > 16) {
        qBeatCount = 1
      }

      this.emitter.emit('quarter-beat')

      if (qBeatCount % 2 === 0) {
        this.emitter.emit('half-beat')

        if (barCount >= 23 && qBeatCount !== 2 && qBeatCount !== 10) {
          this.emitter.emit('funky-hat')
        }
      }
    }
    if (currentBeat > allBeatCount) {
      allBeatCount = currentBeat
      this.emitter.emit('beat')
      beatCount++

      if (beatCount > 4) {
        beatCount = 1
      }

      if (beatCount % 2 === 0) {
        this.emitter.emit('half-bar')
      }

      if (beatCount === 1) {
        barCount++
        this.emitter.emit('bar')

        if (barCount % 2 === 0) {
          this.emitter.emit('bar-2')
        }

        switch (barCount) {
          case 9:
            isClapping = true
            break
          case 16:
            this.emitter.emit('prog-1')
            break
          case 23:
            this.emitter.emit('prog-2')
            break
          case 32:
            this.emitter.emit('prog-3')
            break
          case 39:
            this.emitter.emit('claps-go')
            break
          case 40:
            this.emitter.emit('prog-4')
            break
          case 47:
            this.emitter.emit('claps-back')
            break
          case 49:
            this.emitter.emit('hats-stop')
            break
          case 56:
            this.emitter.emit('prog-5')
            break
          case 61:
            isClapping = false
            this.emitter.emit('claps-fade')
            break
          case 66:
            this.emitter.emit('prog-6')
            break
          case 67:
            this.emitter.emit('drop')
            break
        }
      }

      if (allBeatCount === 31) {
        this.emitter.emit('double-clap')
      }

      if (isClapping) {
        if (beatCount === 2 || beatCount === 4) {
          this.emitter.emit('clap')
        }
      }
      // console.log(beatCount, allBeatCount, barCount)
    }
  }
}

export default new Events()

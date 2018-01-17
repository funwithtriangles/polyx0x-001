import TWEEN from '@tweenjs/tween.js'
import tune from '../assets/sound/ph2.m4a'

const controlEl = document.querySelector('.controls')
const bodyEl = document.body
let isPlaying = false

export const audio = new Audio(tune)
audio.volume = 0

const play = () => {
  bodyEl.classList.add('is-playing')
  audio.play()
  new TWEEN.Tween(audio)
    .to({ volume: 1 }, 3000)
    .easing(TWEEN.Easing.Quadratic.In)
    .start()
  isPlaying = true
}

const pause = () => {
  bodyEl.classList.remove('is-playing')
  new TWEEN.Tween(audio)
    .to({ volume: 0 }, 300)
    .easing(TWEEN.Easing.Quadratic.In)
    .onComplete(() => { audio.pause() })
    .start()
  isPlaying = false
}

const togglePlaying = () => {
  if (isPlaying) {
    pause()
  } else {
    play()
  }
}

controlEl.addEventListener('click', () => {
  togglePlaying()
})

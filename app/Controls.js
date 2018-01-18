import TWEEN from '@tweenjs/tween.js'
import audio from './audio'
import Events from './Events'

const controlEl = document.querySelector('.controls')
const resumeText = document.querySelector('#resume-run')
const playEl = document.querySelector('#control-play')
const bodyEl = document.body

let isPlaying = false

Events.emitter.on('end', () => {
  bodyEl.classList.remove('is-active')
  bodyEl.classList.remove('is-playing')
  bodyEl.classList.add('is-end')
})

const play = () => {
  bodyEl.classList.add('is-playing')
  bodyEl.classList.add('is-active')
  bodyEl.classList.remove('info-is-showing')
  resumeText.innerText = 'resume'
  audio.play()
  new TWEEN.Tween(audio)
    .to({ volume: 1 }, 3000)
    .easing(TWEEN.Easing.Quadratic.In)
    .start()
  isPlaying = true
}

const pause = () => {
  bodyEl.classList.remove('is-playing')
  bodyEl.classList.add('info-is-showing')
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

playEl.addEventListener('click', () => {
  play()
})

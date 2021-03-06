import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import Events from './Events'
import Tower from './Tower'
import Blobs from './Blobs'
import './Controls'
import './analytics'
import '../assets/styles/index.scss'
import '../assets/images/play.svg'
import '../assets/images/pause.svg'
import '../assets/images/cover.gif'
import '../assets/images/share.jpg'

// JS has loaded so add class
document.body.classList.add('is-loaded')

const scene = new THREE.Scene()
const width = window.innerWidth
const height = window.innerHeight
const ratio = width / height
const camera = new THREE.PerspectiveCamera(45, ratio, 1, 5000)
const groupSize = width / 2
const towerHeight = 20
const towerWidth = 5
const blockSize = groupSize / towerWidth
let isRotating = false
const colors = [0x004C48, 0x962515]

scene.fog = new THREE.FogExp2(colors[0], 0.002)

const pLight = new THREE.PointLight(colors[0], 1, 500)
scene.add(pLight)

const rotator = new THREE.Object3D()
scene.add(rotator)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(colors[0], 1)
document.body.appendChild(renderer.domElement)

const tower1 = new Tower(blockSize, colors, towerWidth, towerHeight, -towerHeight * blockSize / 2)
const tower2 = new Tower(blockSize, colors, towerWidth, towerHeight, towerHeight * blockSize / 2)
rotator.add(tower1.group)
rotator.add(tower2.group)

const blobs = new Blobs(renderer, scene)
rotator.add(blobs.group)

this.rotatorProps = {
  rotY: Math.PI / 4,
  rotZ: Math.PI / 4
}

Events.emitter.on('prog-1', () => {
  isRotating = 'stepped'
})

Events.emitter.on('prog-2', () => {
  isRotating = false
})

Events.emitter.on('prog-3', () => {
  isRotating = 'smooth'
})

Events.emitter.on('half-bar', () => {
  if (isRotating === 'stepped') {
    new TWEEN.Tween(this.rotatorProps)
      .to({ rotZ: this.rotatorProps.rotZ + Math.PI / 4 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }
})

Events.emitter.on('double-clap', () => {
  new TWEEN.Tween(this.rotatorProps)
    .to({ rotZ: this.rotatorProps.rotZ - Math.PI / 2 }, 250)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
})

window.addEventListener('resize', onWindowResize, false)

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.position.z = 300 * (ratio / 2)

  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

onWindowResize()

let lastNow = performance.now()
let delta, time
const msPerFrame = 1000 / 60

const animate = () => {
  delta = (performance.now() - lastNow) / msPerFrame
  lastNow = performance.now()
  time = performance.now()

  Events.update(time, delta)
  tower1.update(time, delta)
  tower2.update(time, delta)
  blobs.update(time, delta)

  if (isRotating === 'smooth') {
    this.rotatorProps.rotZ += (0.01 * delta)
  }

  rotator.rotation.z = this.rotatorProps.rotZ

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  TWEEN.update()
}

animate()

import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import Events from './Events'
import Tower from './Tower'
import Blobs from './Blobs'
import '../assets/styles/index.scss'
import '../assets/images/play.svg'
import '../assets/images/pause.svg'

const scene = new THREE.Scene()
const width = window.innerWidth
const height = window.innerHeight
const ratio = width / height
const camera = new THREE.PerspectiveCamera(45, ratio, 1, 5000)
camera.position.z = 300 * (ratio / 2)
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

const animate = () => {
  const time = Date.now()

  Events.update(time)
  tower1.update(time)
  tower2.update(time)
  blobs.update(time)

  if (isRotating === 'smooth') {
    this.rotatorProps.rotZ += 0.01
  }

  rotator.rotation.z = this.rotatorProps.rotZ

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  TWEEN.update()
}

animate()

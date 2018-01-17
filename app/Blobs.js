import * as THREE from 'three'
import { MarchingCubes } from 'three-addons'
import TWEEN from '@tweenjs/tween.js'
import Events from './Events'
import * as c from './constants'

const calcPosZ = (time) => (Math.sin(time) + 0.8) * -500

class Blobs {
  constructor (renderer, scene) {
    const scale = window.innerWidth / 20
    this.renderer = renderer
    this.scene = scene
    this.delta = Date.now()

    this.cubeCamera = new THREE.CubeCamera(1, 10000, 256)

    setTimeout(() => {
      this.cubeCamera.update(this.renderer, this.scene)
    }, 100)

    const mat = new THREE.MeshStandardMaterial(
      { color: 0xFFFFFF, envMap: this.cubeCamera.renderTarget, roughness: 0.1, metalness: 1.0 }
    )
    this.object = new MarchingCubes(32, mat, true, true)
    this.object.position.set(0, 0, 0)
    this.object.scale.set(scale, scale, scale)

    this.object.enableUvs = false
    this.object.enableColors = false

    this.group = new THREE.Object3D()
    this.group.add(this.cubeCamera)
    this.group.add(this.object)

    this.props = {
      rotSpeed: 0.05,
      posZ: -1500
    }
    this.spin = this.spin.bind(this)
    this.startMoving = this.startMoving.bind(this)
    this.stopMoving = this.stopMoving.bind(this)

    Events.emitter.on('clap', this.spin)
    Events.emitter.on('prog-1', this.startMoving)
    Events.emitter.on('prog-3', this.stopMoving)

    this.moving = false

    this.slowlyTowardsCamera()
  }

  spin () {
    // this.cubeCamera.update(this.renderer, this.scene)

    this.props.rotSpeed = 0.2

    new TWEEN.Tween(this.props)
      .to({ rotSpeed: 0.05 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  startMoving () {
    const transitionTime = 2000
    const nextTime = (this.time + (transitionTime / 1000))

    new TWEEN.Tween(this.props)
      .to({ posZ: calcPosZ(nextTime) }, transitionTime)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => { this.moving = true })
      .start()
  }

  stopMoving () {
    const transitionTime = 2000
    this.moving = false

    new TWEEN.Tween(this.props)
      .to({ posZ: 0 }, transitionTime)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => { })
      .start()
  }

  slowlyTowardsCamera () {
    new TWEEN.Tween(this.props)
      .to({ posZ: 0 }, c.barTime * 8)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  update (time) {
    time = time / 1000
    this.time = time
    const object = this.object
    const numblobs = 8

    object.reset()

    if (this.moving) {
      this.props.posZ = calcPosZ(time)
    }

    this.group.rotation.x += this.props.rotSpeed
    this.group.rotation.z += this.props.rotSpeed
    this.group.position.z = this.props.posZ

    // fill the field with some metaballs
    var i, ballx, bally, ballz, subtract, strength

    subtract = 12
    strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1)

    for (i = 0; i < numblobs; i++) {
      ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5
      bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.27 + 0.5
      ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5

      object.addBall(ballx, bally, ballz, strength, subtract)
    }
  }
}

export default Blobs

import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import vertShader from './vert.glsl'
import fragShader from './frag.glsl'

class Block {
  constructor(x, y, z, blockSize, colors, towerWidth, towerHeight) {
    this.blockSize = blockSize
    this.towerHeight = towerHeight
    this.towerWidth = towerWidth

    const cubeGeom = new THREE.BoxGeometry(blockSize, blockSize, blockSize)
    const sphereGeom = new THREE.IcosahedronGeometry(blockSize/2, 3)

    // Tweenable properties
    this.props = {
      scale: 1,
      rot: 0,
      cubeScale: Math.random() > 0.3 ? 1 : 0.001,
      sphereScale: 1,
      xPos: x,
      yPos: y,
      zPos: z,
    }
    this.nextProps = {}

    if (Math.random () > 0.9) {
      this.wavyMat = new THREE.ShaderMaterial({
        vertexShader:   vertShader,
        fragmentShader: fragShader,
        uniforms: {
          iTime: { value: 1.0 },
          seed: { value: Math.random() * 100 },
          color1: { value: new THREE.Color(0xE8216C)},
          color2: { value: new THREE.Color(0xA6FA53)},
        }
      })
    }

    const mats = [
      new THREE.MeshBasicMaterial({
        color: colors[0]
      }),
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      }),
      new THREE.MeshBasicMaterial({
        color: 0xEB186B
      }),
      new THREE.MeshBasicMaterial({
        color: 0x222222
      }),
      new THREE.MeshBasicMaterial({
        color: 0x222222
      }),
      new THREE.MeshBasicMaterial({
        color: 0x222222
      })
    ]


    const sMat = Math.floor(Math.random() * 4)
    this.sphere = new THREE.Mesh(sphereGeom, mats[sMat])


    if (this.wavyMat) {
        mats[0] = this.wavyMat
    }

    this.cube = new THREE.Mesh(cubeGeom, mats)
    this.group = new THREE.Object3D()
    this.group.add(this.sphere)
    this.group.add(this.cube)

    this.visible = true

  }

  change () {
    if (Math.random() > 0.5) {
      this.toggle()
    }
  }

  spin () {
    const r = this.props.r += Math.PI

    new TWEEN.Tween(this.props)
        .to({ rot: r }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
  }

  shapeShift() {
    if (!this.visible && Math.random() > 0.7) {
      let s, c
      if (Math.random() > 0.5) {
        c = 1
        s = 0.001
      } else {
        c = 0.001
        s = 1
      }

      new TWEEN.Tween(this.props)
          .to({ cubeScale: c, sphereScale: s }, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
    }
  }

  toggle () {
    if (this.visible) {
      this.visible = false
    } else {
      this.visible = true
    }

    const s = this.visible ? 1 : 0.001
    const r = this.visible ? 0 : Math.PI

    new TWEEN.Tween(this.props)
        .to({ scale: s, rot: r }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
  }

  move (blocks) {
    const numBlocks = this.towerWidth - 1

    let nextMove = {}
    let doTween

    let moves = {
      up: {
        prop: 'yPos',
        val: this.props.yPos + 1,
        enabled: true
      },
      down: {
        prop: 'yPos',
        val: this.props.yPos - 1,
        enabled: true
      },
      left: {
        prop: 'xPos',
        val: this.props.xPos + 1,
        enabled: true
      },
      right: {
        prop: 'xPos',
        val: this.props.xPos - 1,
        enabled: true
      },
      forward: {
        prop: 'zPos',
        val: this.props.zPos + 1,
        enabled: true
      },
      backward: {
        prop: 'zPos',
        val: this.props.zPos - 1,
        enabled: true
      }
    }

    for (let i = 0; i < blocks.length; i ++) {
      const props = blocks[i].props
      const nextProps = blocks[i].nextProps

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === this.props.yPos &&
          props.zPos === moves.forward.val ||
          moves.forward.val > this.towerHeight - 1
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === moves.forward.val
        )
      ) {
        moves.forward.enabled = false
      }

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === this.props.yPos &&
          props.zPos === moves.backward.val ||
          moves.forward.val < 0
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === moves.backward.val
        )
      ) {
        moves.backward.enabled = false
      }

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === moves.up.val &&
          props.zPos === this.props.zPos ||
          moves.up.val > numBlocks
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === moves.up.val &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.up.enabled = false
      }

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === moves.down.val &&
          props.zPos === this.props.zPos ||
          moves.down.val < 0
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === moves.down.val &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.down.enabled = false
      }

      if (
        (
          props.xPos === moves.left.val &&
          props.yPos === this.props.yPos &&
          props.zPos === this.props.zPos ||
          moves.left.val > numBlocks
        ) ||
        (
          nextProps.xPos === moves.left.val &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.left.enabled = false
      }

      if (
        (
          props.xPos === moves.right.val &&
          props.yPos === this.props.yPos &&
          props.zPos === this.props.zPos ||
          moves.right.val < 0
        ) ||
        (
          nextProps.xPos === moves.right.val &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.right.enabled = false
      }
    }

    const permittedMoves =
    Object.keys(moves).filter(key =>
      moves[key].enabled
    )

    if (permittedMoves.length && Math.random() > 0.5) {
      const i = Math.floor(Math.random() * permittedMoves.length)
      const move = moves[permittedMoves[i]]
      nextMove = { [move.prop]: move.val }
      doTween = true
    }

    this.nextProps = Object.assign({}, this.props, nextMove)

    if (doTween) {
      new TWEEN.Tween(this.props)
          .to(nextMove, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
    }
  }

  update() {
    const s = this.props.scale
    const cs = this.props.cubeScale
    const ss = this.props.sphereScale
    const blockSize = this.blockSize
    const towerHeight = this.towerHeight


    this.group.scale.set(s,s,s)
    this.cube.scale.set(cs,cs,cs)
    this.sphere.scale.set(ss,ss,ss)
    this.group.rotation.y = this.props.rot

    this.group.position.x = this.props.xPos * blockSize - blockSize * 2
    this.group.position.y = this.props.yPos * blockSize - blockSize * 2
    this.group.position.z = this.props.zPos * blockSize - blockSize * towerHeight / 2

    if (this.wavyMat) {
      this.wavyMat.uniforms.iTime.value = performance.now() / 1000
    }

  }
}

export default Block

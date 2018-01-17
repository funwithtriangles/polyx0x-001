import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

class Block {
  constructor (x, y, z, blockSize, colors, towerWidth, towerHeight, wavyMats) {
    this.blockSize = blockSize
    this.towerHeight = towerHeight
    this.towerWidth = towerWidth

    const cubeGeom = new THREE.BoxBufferGeometry(blockSize, blockSize, blockSize)

    // Tweenable properties
    this.props = {
      scale: 1,
      rot: 0,
      cubeScale: 1,
      // sphereScale: 1,
      xPos: x,
      yPos: y,
      zPos: z
    }
    this.nextProps = {}

    const wavyMatIndex = Math.floor(Math.random() * wavyMats.length)

    this.wavyMat = wavyMats[wavyMatIndex]

    this.defaultMats = [
      new THREE.MeshLambertMaterial({
        color: colors[0]
      }),
      new THREE.MeshLambertMaterial({
        color: 0xffffff
      }),
      new THREE.MeshLambertMaterial({
        color: colors[1]
      }),
      new THREE.MeshLambertMaterial({
        color: 0x222222
      }),
      new THREE.MeshLambertMaterial({
        color: 0x222222
      }),
      new THREE.MeshLambertMaterial({
        color: 0x222222
      })
    ]

    this.mats = this.defaultMats.slice(0)

    this.cube = new THREE.Mesh(cubeGeom, this.mats)
    this.group = new THREE.Object3D()
    this.group.add(this.cube)

    this.flash()

    this.visible = true
  }

  change () {
    if (Math.random() > 0.5) {
      this.toggle()
    }
  }

  flash (boosted) {
    this.cube.material = this.defaultMats.slice(0)
    this.hasWavy = false

    if (boosted || Math.random() > 0.5) {
      this.hasWavy = true
      this.cube.material[Math.floor(Math.random() * 4)] = this.wavyMat

      if (boosted) {
        this.cube.material[Math.floor(Math.random() * 4)] = this.wavyMat
      }
    }
  }

  spin () {
    const r = this.props.r += Math.PI

    new TWEEN.Tween(this.props)
      .to({ rot: r }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  shapeShift () {
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
        .start()
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
      .start()
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

    for (let i = 0; i < blocks.length; i++) {
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

    if (this.props.yPos === 2) {
      if (moves.right.val === 2) moves.right.enabled = false
      if (moves.left.val === 2) moves.left.enabled = false
    }

    if (this.props.xPos === 2) {
      if (moves.up.val === 2) moves.up.enabled = false
      if (moves.down.val === 2) moves.down.enabled = false
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
        .easing(TWEEN.Easing.Bounce.Out)
        .start()
    }
  }

  update (time) {
    const blockSize = this.blockSize
    const towerHeight = this.towerHeight

    // this.group.scale.set(s,s,s)
    // this.cube.scale.set(cs,cs,cs)
    // this.sphere.scale.set(ss,ss,ss)
    // this.group.rotation.y = this.props.rot

    this.group.position.x = this.props.xPos * blockSize - blockSize * 2
    this.group.position.y = this.props.yPos * blockSize - blockSize * 2
    this.group.position.z = this.props.zPos * blockSize - blockSize * towerHeight / 2
  }
}

export default Block

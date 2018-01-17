import * as THREE from 'three'
import _ from 'lodash'

class Pipes {
  constructor (blockSize, towerHeight) {
    const boundry = [2, 2]

    // const cubeGeom = new THREE.BoxGeometry(blockSize, blockSize, blockSize)
    // const cubeMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
    // const blockHelper = new THREE.Mesh(cubeGeom, cubeMaterial)
    const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x2EFFFD, fog: false })
    this.group = new THREE.Object3D()

    const createBend = (prevDir, nextDir) => {
      const bendCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-prevDir[0] * blockSize / 2, -prevDir[1] * blockSize / 2, -prevDir[2] * blockSize / 2),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(nextDir[0] * blockSize / 2, nextDir[1] * blockSize / 2, nextDir[2] * blockSize / 2)
      )
      const bendGeom = new THREE.TubeBufferGeometry(bendCurve, 10, 10, 8, false)
      const bendMesh = new THREE.Mesh(bendGeom, material)
      const bend = new THREE.Object3D()
      bend.add(bendMesh)
      // bend.add(blockHelper.clone())
      return bend
    }

    const straightLine = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(blockSize, 0, 0)
    )
    const straightGeometry = new THREE.TubeBufferGeometry(straightLine, 10, 10, 8, false)
    const straightMesh = new THREE.Mesh(straightGeometry, material)
    straightMesh.rotation.y = Math.PI / 2
    straightMesh.position.z = blockSize / 2
    const straight = new THREE.Object3D()
    straight.add(straightMesh)
    // straight.add(blockHelper.clone())

    const positions = []
    let nextPos = [1, 0, 0]
    let failCount = 0
    const failLimit = 50
    let z = 0
    let i = 0
    while (z > -towerHeight && failCount < failLimit) {
      const calc = () => {
        let rp
        if (Math.random() > 0.5) {
          // Encourage twisty pipes by only allowing
          // them to go forwards 50% of the time
          rp = Math.floor(Math.random() * 3)
        } else {
          rp = Math.floor(Math.random() * 2)
        }
        if (rp === 2) {
          z--
        }
        const r = rp === 2 ? -1 : Math.random() > 0.5 ? 1 : -1
        const dir = [0, 0, 0]
        dir[rp] = r

        nextPos = [pos[0] + dir[0], pos[1] + dir[1], pos[2] + dir[2]]
        let allowNextPos = true

        if (nextPos[0] > boundry[0] || nextPos[0] < -boundry[0] ||
          nextPos[1] > boundry[1] || nextPos[1] < -boundry[1] ||
          (nextPos[0] === 0 && nextPos[1] === 0)
        ) {
          allowNextPos = false
        } else {
          for (let j = 0; j < i; j++) {
            const p = positions[j]
            if (_.isEqual(nextPos, p.pos)) {
              allowNextPos = false
            }
          }
        }

        if (allowNextPos) {
          failCount = 0
          positions[i] = { dir, pos }
          i++
        } else if (failCount < failLimit) {
          failCount++
          calc()
        }
      }
      const pos = nextPos

      calc()
    }

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i].pos
      const d = positions[i].dir
      const prevDir = i > 0 ? positions[i - 1].dir : [1, 0, 0]

      let s

      if (_.isEqual(prevDir, d)) {
        s = straight.clone()
        s.lookAt(d[0], d[1], d[2])
      } else {
        s = createBend(prevDir, d)
      }

      s.position.x = p[0] * blockSize
      s.position.y = p[1] * blockSize
      s.position.z = p[2] * blockSize

      this.group.add(s)
    }
  }
}

export default Pipes

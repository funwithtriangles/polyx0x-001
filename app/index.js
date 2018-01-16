import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js'

import vertShader from './vert.glsl'
import fragShader from './frag.glsl'
import Tower from './Tower'
const scene = new THREE.Scene();
const width = window.innerWidth
const height = window.innerHeight
const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
const groupSize = width / 2
const towerHeight = 20
const towerWidth = 5
const blockSize = groupSize / towerWidth
let gamma = performance.now()
let beta = performance.now()
const colors = [0x004C48, 0x962515]

scene.fog = new THREE.FogExp2(colors[0], 0.001)

const pLight = new THREE.PointLight( colors[0], 1, 500 )
pLight.position.set(0,0,-100)
scene.add(pLight)

const rotator = new THREE.Object3D()
scene.add(rotator)

// const colors = [0xA4FC44, 0xE9246D]


const bgGeom = new THREE.PlaneGeometry(width, height)
const bgMat = new THREE.ShaderMaterial({
  vertexShader:   vertShader,
  fragmentShader: fragShader,
  uniforms: {
    iTime: { value: 1.0 },
    seed: { value: Math.random() * 100 },
    color1: { value: new THREE.Color(colors[0])},
    color2: { value: new THREE.Color(colors[1])},
  }
})
// const bgMesh = new THREE.Mesh(bgGeom, bgMat)
// bgMesh.position.z = -5000
// scene.add(bgMesh)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( colors[0], 1);
document.body.appendChild( renderer.domElement );

const tower1 = new Tower(blockSize, colors, towerWidth, towerHeight, - towerHeight * blockSize / 2)
const tower2 = new Tower(blockSize, colors, towerWidth, towerHeight, towerHeight * blockSize / 2)
rotator.add(tower1.group)
rotator.add(tower2.group)

this.rotatorProps = {
  rotY: Math.PI / 4,
  rotZ: Math.PI / 4
}

// rotator.rotation.x = Math.PI / 4

const animate = () => {
  const now = performance.now()

  tower1.update(now)
  tower2.update(now)

  if (now > gamma + 4000) {
    new TWEEN.Tween(this.rotatorProps)
      .to({ rotZ: this.rotatorProps.rotZ + Math.PI / 4 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    gamma = now
  }

  rotator.rotation.z = this.rotatorProps.rotZ

  bgMat.uniforms.iTime.value = now / 2000

  requestAnimationFrame( animate );
  renderer.render(scene, camera);
  TWEEN.update(performance.now());
};

animate();

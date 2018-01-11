import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js'

import Tower from './Tower'
const scene = new THREE.Scene();
const width = window.innerWidth
const height = window.innerHeight
const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 10000 );
camera.position.z = 800
const groupSize = 400
const towerHeight = 30
const towerWidth = 4
const blockSize = groupSize / towerWidth
let gamma = performance.now()
let beta = performance.now()

const rotator = new THREE.Object3D()
scene.add(rotator)

const bgColor = 0xA4FC44

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( bgColor, 1);
document.body.appendChild( renderer.domElement );

const tower1 = new Tower(blockSize, [bgColor], towerWidth, towerHeight)
rotator.add(tower1.group)

this.rotatorProps = {
  rotY: Math.PI / 4,
  rotZ: Math.PI / 4
}

rotator.rotation.x = Math.PI / 4

const animate = () => {
  const now = performance.now()

  tower1.update(now)

  if (now > gamma + 4000) {
    new TWEEN.Tween(this.rotatorProps)
      .to({ rotY: this.rotatorProps.rotY + Math.PI / 4 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    gamma = now
  }

  if (now > beta + 8000) {
    new TWEEN.Tween(this.rotatorProps)
      .to({ rotX: this.rotatorProps.rotZ + Math.PI / 4 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    beta = now
  }

  rotator.rotation.y = this.rotatorProps.rotY
  rotator.rotation.z = this.rotatorProps.rotZ


  requestAnimationFrame( animate );
  renderer.render(scene, camera);
  TWEEN.update(performance.now());
};

animate();

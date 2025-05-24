import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera, * as cameraUtils from './camera.js';
import { addResizeListener } from './resize.js';
import scene from './scene.js';
import createControls from './controls.js';
import grids from './grids.js';
import { resetLabels, scaleLabels } from './grids.js';

// Always need 3 objects
// Scene, camera, renderer

const baseLabelSize = 40;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#background') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls
const controls = createControls(camera, renderer);
// 1000 is your zoom scale
addResizeListener(camera, renderer, 1000);

camera.position.set(-500,600,500);

const center = new THREE.Vector3(grids.pSize/2, grids.pSize/2, -grids.pSize/2);
camera.lookAt(center);
controls.target.copy(center);
camera.zoom = 3;
controls.update();
camera.updateProjectionMatrix();

const centerMarker = new THREE.Mesh(
  new THREE.SphereGeometry(5),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
centerMarker.position.set(grids.pSize/2, grids.pSize/2, grids.pSize/2);
scene.add(centerMarker);

// origin axeshelper
const origin = new THREE.AxesHelper(300);
origin.position.set(0,0,0);
scene.add(origin);

// Add the grid
scene.add(grids);

function main() {

  function animate() {
    // tells browser to perform animation
    requestAnimationFrame(animate);

    scaleLabels(baseLabelSize, camera);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);
main();

// Fullscreen button
document.getElementById('fullscreen-btn').addEventListener('click', () => {
  const elem = document.documentElement;

  if (!document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
    // ENTER fullscreen
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    // EXIT fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
});

// Reset camera button
document.getElementById('resetCamera-btn').addEventListener('click', () => {
  camera.position.set(-500, 500, 500);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);
  controls.update();
  camera.updateProjectionMatrix();

  // Reset controls
  controls.enableRotate = true;
  // reset label positions
  resetLabels();
});

// XY camera button
document.getElementById('xyCamera-btn').addEventListener('click', () => {
  const center = new THREE.Vector3(grids.pSize / 2, grids.pSize / 2, 0);
  // Position the camera above the plane, looking down
  camera.position.set(grids.pSize/2, grids.pSize/2, 500);
  // Set "up" to +Z so the plane isn't rotated visually
  camera.up.set(0, 1, 0);
  // Look at the center of the plane
  camera.lookAt(center);
  controls.enableRotate = false;
  // Update OrbitControls target and sync
  controls.target.copy(center);
  camera.updateProjectionMatrix();

  // Reset label positions
  resetLabels();

  // move Z label
  grids.zLabel.position.set(0, -10, grids.pSize + 10);
});

// ZY camera button
document.getElementById('zyCamera-btn').addEventListener('click', () => {
  const center = new THREE.Vector3(0, grids.pSize / 2, grids.pSize / 2);
  camera.position.set(500, grids.pSize/2, grids.pSize/2);
  camera.up.set(0, 1, 0);
  camera.lookAt(center);
  controls.enableRotate = false;
  controls.target.copy(center);
  camera.updateProjectionMatrix();

  // Reset label positions
  resetLabels();

  // move 
  grids.xLabel.position.set(grids.pSize+10, -10, 0);
});

// XZ camera button
document.getElementById('xzCamera-btn').addEventListener('click', () => {
  const center = new THREE.Vector3(grids.pSize / 2, 0, grids.pSize / 2);  
  camera.position.set(grids.pSize / 2, 500, grids.pSize / 2);
  camera.up.set(0, 0, -1);
  camera.lookAt(center);
  controls.enableRotate = false;
  controls.target.copy(center);
  camera.updateProjectionMatrix();

  // Reset label positions
  resetLabels();

  // move Y label
  grids.yLabel.position.set(0, grids.pSize+10, -10);
});
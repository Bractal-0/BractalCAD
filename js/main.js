import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera from './camera.js';
import { zoomScale } from './camera.js';
import scene from './scene.js';
import createControls from './controls.js';
import gridsGroup, {
  pSize, xyGroup, xzGroup, zyGroup,
  xLabel, yLabel, zLabel} from './grids.js';
import { resetLabels } from './grids.js';

// Always need 3 objects
// Scene, camera, renderer

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#background') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls
const controls = createControls(camera, renderer);

// Add the grid
scene.add(gridsGroup);


// Draw a circle at (0, 0, 0)
// const circleRadius = 50;
// const circleSegments = 40;
// const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
// const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.7, transparent: true });
// const circle = new THREE.Mesh(circleGeometry, circleMaterial);
// circle.position.set(0, 0, 0);
// circle.rotation.x = -Math.PI / 2; // Make it lie flat on the XY plane
// scene.add(circle);

//const helper = new THREE.CameraHelper(camera);

function main() {

  function animate() {
    // tells browser to perform animation
    requestAnimationFrame(animate);

    //console.log('camera', camera.rotation);
    //scene.add(helper);

    // --- Axis label scaling (optional, for consistent size) ---
    const baseLabelSize = 40;
    const labelScale = baseLabelSize / camera.zoom;
    xLabel.scale.set(labelScale, labelScale, labelScale);
    yLabel.scale.set(labelScale, labelScale, labelScale);
    zLabel.scale.set(labelScale, labelScale, labelScale);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);
main();

const d = 1000;
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -aspect *d / 2;
  camera.right = aspect * d / 2;
  camera.top = d / 2;
  camera.bottom = -d / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

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
  camera.position.set(500, 500, 500);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);
  controls.update();
  camera.updateProjectionMatrix();

  // Reset controls
  controls.enableRotate = true;
  // Reset label positions
  xLabel.position.set(pSize+10, 0, 0);
  yLabel.position.set(0, pSize+10, 0);
  zLabel.position.set(0, 0, pSize+10);
});

// XY camera button
document.getElementById('xyCamera-btn').addEventListener('click', () => {
  const center = new THREE.Vector3(pSize / 2, pSize / 2, 0);
  // Position the camera above the plane, looking down
  camera.position.set(pSize/2, pSize/2, 500);
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
  zLabel.position.set(0, -10, pSize + 10);
});

// ZY camera button
document.getElementById('zyCamera-btn').addEventListener('click', () => {
  const center = new THREE.Vector3(0, pSize / 2, pSize / 2);
  camera.position.set(500, pSize/2, pSize/2);
  camera.up.set(0, 1, 0);
  camera.lookAt(center);
  controls.enableRotate = false;
  controls.target.copy(center);
  camera.updateProjectionMatrix();

  // Reset label positions
  resetLabels();

  // move 
  xLabel.position.set(pSize+10, -10, 0);
});

// XZ camera button
document.getElementById('xzCamera-btn').addEventListener('click', () => {
  const center = new THREE.Vector3(pSize / 2, 0, pSize / 2);  
  camera.position.set(pSize / 2, 500, pSize / 2);
  camera.up.set(0, 0, -1);
  camera.lookAt(center);
  controls.enableRotate = false;
  controls.target.copy(center);
  camera.updateProjectionMatrix();

  // Reset label positions
  resetLabels();

  // move Y label
  yLabel.position.set(0, pSize+10, -10);
});
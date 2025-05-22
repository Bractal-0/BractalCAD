import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera from './camera.js';
import scene from './scene.js';
import createControls from './controls.js';
import gridsGroup, {
  pSize, xyGroup, xzGroup, yzGroup,
  xLabel, yLabel, zLabel} from './grids.js';

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

    console.log('camera', camera.position);
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
  const elem = document.documentElement; // or use renderer.domElement for just the canvas
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE11
    elem.msRequestFullscreen();
  }
});

// XY camera button
document.getElementById('xyCamera-btn').addEventListener('click', () => {
  camera.position.set(0, 0, 500);
  camera.updateProjectionMatrix();
  controls.update();
});

// ZY camera button
document.getElementById('zyCamera-btn').addEventListener('click', () => {
  camera.position.set(500, 0, 0);
  camera.updateProjectionMatrix();
  controls.update();
});

// XZ camera button
document.getElementById('xzCamera-btn').addEventListener('click', () => {
  camera.position.set(0, 500, 0);
  camera.lookAt(pSize/2, pSize/2, pSize/2);
  camera.updateProjectionMatrix();
  controls.update();
});
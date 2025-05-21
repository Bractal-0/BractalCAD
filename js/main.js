import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera from './camera.js';
import scene from './scene.js';
import createControls from './controls.js';
import gridsGroup, {
  pSize, xyGroup, xzGroup, yzGroup,
  xLabel, yLabel, zLabel,
  setXYGrid, setXZGrid, setYZGrid
} from './grids.js';
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
const circleRadius = 50;
const circleSegments = 1;
const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.7, transparent: true });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(0, 0, 0);
circle.rotation.x = -Math.PI / 2; // Make it lie flat on the XY plane
scene.add(circle);

function main() {

  function animate() {
    // tells browser to perform animation
    requestAnimationFrame(animate);

    // --- Axis label scaling (optional, for consistent size) ---
    const baseLabelSize = 4;
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

const d = 50;
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
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

function gridSteps(worldPerPixel, minPixelSpacing = 40) {
  const niceSteps = [1, 10, 20, 50, 100, 200, 500, 1000]; // adjust for your units
  for (let i = 0; i < niceSteps.length; i++) {
    if (niceSteps[i] / worldPerPixel >= minPixelSpacing) {
      return niceSteps[i];
    }
  }
  return niceSteps[niceSteps.length - 1];
}

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);
// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(pointLight, ambientLight);
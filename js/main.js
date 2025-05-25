import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera, * as cameraUtils from './camera.js';
import { addResizeListener} from './resize.js';
import scene from './scene.js';
import createControls from './controls.js';
import grids from './grids.js';
import { toggleGrids, scaleGrids, scaleLabels } from './grids.js';
//import * as TOOLS from 'tools';

// Always need 3 objects
// Scene, camera, renderer

const cameraZoom = 3;
const cameraZoomScale = 1000;
const cameraNear = 0.1;
// far should be pSize*2
const cameraFar = 3000;

camera.near = cameraNear;
camera.far = cameraFar;
// Distance between camera and planes
const halfPlane = grids.pSize/2;
const center = new THREE.Vector3(halfPlane, halfPlane, -halfPlane);

const baseLabelSize = 40;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#background') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls
const controls = createControls(camera, renderer);
// 1000 is your zoom scale
addResizeListener(camera, renderer, cameraZoomScale);

// Set camera zoom
//setZoom(camera, grids.pSize);

setCameraPos(-halfPlane, halfPlane + halfPlane*2, halfPlane);
camera.zoom = cameraZoom;
setCameraTarget(center);

// OrbitControls can derive rotation or lookat by position and target.

function setCameraTarget(target) {
  controls.target.copy(target);
  refreshConCam();
}

function setCameraPos(x, y , z) {
  camera.position.set(x, y, z);
  refreshConCam();
}

function refreshConCam() {
  camera.near = cameraNear;
  camera.far = cameraFar;
  camera.up.set(0, 1, 0);
  controls.update();
  camera.updateProjectionMatrix();
}

// const centerMarker = new THREE.Mesh(
//   new THREE.SphereGeometry(5),
//   new THREE.MeshBasicMaterial({ color: 0x000000 })
// );
// centerMarker.position.set(grids.pSize/2, grids.pSize/2, grids.pSize/2);
// scene.add(centerMarker);

// origin axeshelper
const origin = new THREE.AxesHelper(300);
origin.position.set(0,0,0);
scene.add(origin);

// Add the grid
scene.add(grids);

//raycaster
// const points = [];  // Array to store THREE.Vector3 points
// const raycaster = new THREE.Raycaster();
// const pointer = new THREE.Vector2();
// function onPointerMove(event) {
//     pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     raycaster.setFromCamera(pointer, camera);
//     const intersects = raycaster.intersectObject(plane);

//     if (intersects.length > 0) {
//         points.push(intersects[0].point.clone());

//         const geometry = new THREE.BufferGeometry().setFromPoints(points);

//         if (!window.line) {
//             const material = new THREE.LineBasicMaterial({ color: 0x000000 });
//             window.line = new THREE.Line(geometry, material);
//             scene.add(window.line);
//         } else {
//             window.line.geometry.dispose();
//             window.line.geometry = geometry;
//         }
//     }
// }

//window.addEventListener('pointermove', onPointerMove);

function main() {

  function animate() {
    // tells browser to perform animation
    requestAnimationFrame(animate);

    scaleLabels(baseLabelSize, camera);

    console.log(camera.position);
    console.log(camera.up);
    console.log(camera.near, camera.far);

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
// Toggle grids
document.getElementById('toggle-grid-btn').addEventListener('click', () => {
  toggleGrids(scene);
});
// XY camera button
document.getElementById('xyCamera-btn').addEventListener('click', () => {
  // Yellow plane
  setCameraPos(-halfPlane, halfPlane, halfPlane);
  setCameraTarget(center);
  controls.enableRotate = false;
  // Lock vertical rotation
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  // Lock horizontal rotation
  controls.minAzimuthAngle = 0;
  controls.maxAzimuthAngle = 0;
  refreshConCam();
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
});
// Return to orbit
document.getElementById('orbit-btn').addEventListener('click', () => {
  setCameraTarget(center);
  controls.enableRotate = true;
  // unlock vertical rotation
  controls.minPolarAngle = 0; // allow looking up
  controls.maxPolarAngle = Math.PI; // allow looking down
  // unlock horizontal rotation
  controls.minAzimuthAngle = -Infinity; // no limit left
  controls.maxAzimuthAngle = Infinity; // no limit right
  refreshConCam();
});

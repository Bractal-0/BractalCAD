import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera, * as cameraUtils from './camera.js';
import { addResizeListener} from './resize.js';
import scene from './scene.js';
import createControls from './controls.js';
import cube from './cube.js';
import { toggleGrids, scaleGrids, scaleLabels } from './cube.js';
//import * as TOOLS from 'tools';

// Always need 3 objects
// Scene, camera, renderer

const cameraZoom = 3;
const cameraFrustrumSize = 1000;
const cameraNear = 0.1;
// camera.far should be pSize*2
const cameraFar = 3000;

camera.zoom = cameraZoom;
camera.near = cameraNear;
camera.far = cameraFar;

// input number button for cube gap with max and min.

// Center of cube
const center = new THREE.Vector3(cube.halfPlane, cube.halfPlane, -cube.halfPlane);

const baseLabelSize = 40;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#background') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls
const controls = createControls(camera, renderer);

addResizeListener(camera, renderer, cameraFrustrumSize);

// Set camera zoom
//setZoom(camera, cube.pSize);

setCameraPos(-cube.pSize-cube.gap, cube.pSize*2+cube.gap, cube.pSize+cube.gap);
setCameraTarget(center);
camera.zoom = cameraZoom;

// OrbitControls can derive rotation or lookat by position and target.

function setCameraTarget(target) {
  camera.lookAt(target);
  controls.target.copy(target);
  refreshConCam();
}

function setCameraPos(x, y , z) {
  camera.position.set(x, y, z);
  refreshConCam();
}

function refreshConCam() {
  controls.update();
  camera.updateProjectionMatrix();
}

//  Might need to adjust for top and bottom planes
function lockRotation() {
  controls.enableRotate = false;
  // Lock vertical rotation
  // controls.minPolarAngle = Math.PI / 2;
  // controls.maxPolarAngle = Math.PI / 2;
  // // Lock horizontal rotation
  // controls.minAzimuthAngle = 0;
  // controls.maxAzimuthAngle = 0;
  refreshConCam();
}

function unlockRotation() {
  camera.up.set(0, 1, 0);
  controls.enableRotate = true;
  // unlock vertical rotation
  // controls.minPolarAngle = 0; // allow looking up
  // controls.maxPolarAngle = Math.PI; // allow looking down
  // // unlock horizontal rotation
  // controls.minAzimuthAngle = -Infinity; // no limit left
  // controls.maxAzimuthAngle = Infinity; // no limit right
  refreshConCam();
}

// const centerMarker = new THREE.Mesh(
//   new THREE.SphereGeometry(5),
//   new THREE.MeshBasicMaterial({ color: 0x000000 })
// );
// centerMarker.position.set(cube.pSize/2, cube.pSize/2, cube.pSize/2);
// scene.add(centerMarker);

// origin axeshelper
const origin = new THREE.AxesHelper(300);
origin.position.set(0,0,0);
scene.add(origin);

// Add the grid
scene.add(cube);

function main() {

  function animate() {
    // tells browser to perform animation
    requestAnimationFrame(animate);

    scaleLabels(baseLabelSize, camera);

    // console.log(camera.position);
    // console.log(camera.up);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
// Run startup animation, then start main app
//runStartupAnimation(renderer, main);
main();

const isDrawing = false;

while (isDrawing === true) {
  //raycaster
  const points = [];  // Array to store THREE.Vector3 points
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function onPointerMove(e) {
      pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(plane);

      if (intersects.length > 0) {
          points.push(intersects[0].point.clone());

          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          if (!window.line) {
              const material = new THREE.LineBasicMaterial({ color: 0x000000 });
              window.line = new THREE.Line(geometry, material);
              scene.add(window.line);
          } else {
              window.line.geometry.dispose();
              window.line.geometry = geometry;
          }
      }
  }
}



// && which tool
window.addEventListener('mousedown', (e) => {
  // 0 is left button
  if (e.button === 0) isDrawing = true;
});

window.addEventListener('mouseup', (e) => {
  // 0 is left button
  if (e.button === 0) isDrawing = false;
});



controls.mouseButtons.LEFT = null;

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    // disables left mouse action
    controls.mouseButtons.LEFT = null;
  }
});

// line tool button
document.getElementById('line-btn').addEventListener('click', () => {
  // Switch tool to line
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
// Toggle grids
document.getElementById('toggle-grid-btn').addEventListener('click', () => {
  toggleGrids(scene);
});
// XY Yellow plane camera button
document.getElementById('xyCamera-btn').addEventListener('click', () => {
  setCameraPos(cube.halfPlane, cube.halfPlane, cube.pSize+cube.gap*2);
  setCameraTarget(center);
  refreshConCam();
});
// ZY Red plane camera button
document.getElementById('zyCamera-btn').addEventListener('click', () => {
  setCameraPos(-cube.pSize-cube.gap, cube.halfPlane, -cube.halfPlane);
  setCameraTarget(center);
  refreshConCam();
});
// XZ Blue plane camera button
document.getElementById('xzCamera-btn').addEventListener('click', () => {
  setCameraPos(cube.halfPlane, -cube.pSize - cube.gap, -cube.halfPlane);
  setCameraTarget(center);
  refreshConCam();
});
// AB Pink plane camera button
document.getElementById('abCamera-btn').addEventListener('click', () => {
  setCameraPos(cube.halfPlane, cube.halfPlane, -cube.pSize-cube.gap*2);
  setCameraTarget(center);
  refreshConCam();
});
// CB Green plane camera button
document.getElementById('cbCamera-btn').addEventListener('click', () => {
  setCameraPos(cube.pSize+cube.gap*3, cube.halfPlane, -cube.halfPlane);
  setCameraTarget(center);
  refreshConCam();
});
// AB Orange plane camera button
document.getElementById('acCamera-btn').addEventListener('click', () => {
  setCameraPos(cube.halfPlane, cube.pSize+cube.gap*2, -cube.halfPlane);
  setCameraTarget(center);
  refreshConCam();
});
// Return to orbit
document.getElementById('orbit-btn').addEventListener('click', () => {
  setCameraTarget(center);
  refreshConCam();
});

import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera from './camera.js';
import { addResizeListener} from './resize.js';
import scene from './scene.js';
import createControls from './controls.js';
import cube from './cube.js';
import { toggleGrids, scaleGrids, scaleLabels } from './cube.js';
//import line from '/js/tools/line.js';
import ray from './ray.js';
import raycast from './raycast.js';
import { castRay } from './raycast.js';
//import objects from './sceneLogic.js';

// Always need 3 objects
// Scene, camera, renderer

let renderer, controls;

let center, defaultOrbit;

// White background
let background = new THREE.Color(0xffffff);

// Camera settings
let zoomScale = 13 / cube.pSize;
let cameraZoom = zoomScale;
let frustrumSize = 50;
const cameraNear = 0.1;
let cameraFar = cube.pSize*4 + cube.gap*4;

camera.zoom = cameraZoom;
camera.near = cameraNear;
camera.far = cameraFar;

// Cube settings
// input number button for cube gap with max and min.

let lineTool = false;

let spaceDown = false;

const lines = [];

let clicks, isDrawing = false;

let localLine, localStart, localEnd;

// origin axeshelper
const origin = new THREE.AxesHelper(300);
origin.position.set(0,0,0);
scene.add(origin);

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);

init();
animate();

function init () {
  scene.background = background;

  // // Add lights for 3d object
  // const ambientLight = new THREE.AmbientLight(0x404040, 1);
  // scene.add(ambientLight);

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(1, 1, 1).normalize();
  // scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#background') });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  

  // Orbit controls
  controls = createControls(camera, renderer);
  // Disable left mouse button
  controls.mouseButtons.LEFT = null;

  // Set camera position and orientation;
  // Center of cube
  center = new THREE.Vector3(cube.halfPlane, cube.halfPlane, -cube.halfPlane);
  defaultOrbit = new THREE.Vector3(-cube.pSize-cube.gap, cube.pSize*2+cube.gap, cube.pSize+cube.gap);

  setCameraPos(defaultOrbit);
  setCameraTarget(center);
  camera.zoom = cameraZoom;
  refreshConCam();

  // Dynamic resize
  addResizeListener(camera, frustrumSize, renderer);

  // Add GUI controls
  // const gui = new GUI();
  // gui.add(DOM, 'gap', 0.01, 10).name('interface').onChange(() => {
  //   scaleGrids(cube);
  //   scaleLabels(camera);
  // });

  // Add the CAD cube to scene
  scene.add(cube);
}

function animate () {
  // tells browser to perform animation
  requestAnimationFrame(animate);

  camera.updateMatrixWorld();

  // console.log('Camera position:', camera.position);

  scaleLabels(camera);

  castRay();

  //drawing(isDrawing);
  //console.log(ray.pointer.x, ray.pointer.y);

  controls.update();
  renderer.render(scene, camera);
}

//console.log(objects);

const gui1 = new GUI();
gui1.add(camera, 'zoom', 1, 30, 1).listen();

// OrbitControls can derive rotation or lookat by position and target.

function setCameraPos(vector) {
  camera.position.set(vector.x, vector.y, vector.z);
  refreshConCam();
}

function setCameraTarget(vector) {
  camera.lookAt(vector);
  controls.target.copy(vector);
  refreshConCam();
}

function resetCamera() {
  setCameraPos(defaultOrbit);
  setCameraTarget(center);
  refreshConCam();
}

function refreshConCam() {
  controls.update();
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}

// Lock rotation function
//  Might need to adjust for top and bottom planes
function lockRotation() {
  controls.enableRotate = false;
  refreshConCam();
}

function unlockRotation() {
  controls.enableRotate = true;
  refreshConCam();
}

// Create a new line
//const lineGeometry = new THREE.BufferGeometry();
//const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

function drawing() {
  if (lineTool === true && raycast.plane && raycast.point) {
    console.log("drawing!");

    if (clicks === 0) {
      clicks++;
      isDrawing = true;

      // Set last plane
      raycast.lastPlane = raycast.plane;

      // thisPlane();

      localStart = raycast.plane.worldToLocal(raycast.point.clone());

      const geometry = new THREE.BufferGeometry().setFromPoints([
        localStart,
        localStart.clone(), // dummy second point
      ]);

      const material = new THREE.LineBasicMaterial({ color: 0x000000 });
      localLine = new THREE.Line(geometry, material);
      
      //console.log("line start x: " + localLine.geometry.attributes.position.array[2]);
      
      scene.add(localLine);

    } else if (clicks === 1) {
      // Finalize line
      localEnd = raycast.plane.worldToLocal(raycast.point.clone());

      //console.log(raycast.point);

      // Keep the line in scene or store it if needed
      resetDrawing();
    }
  } else {
    resetDrawing();
  }
}

function resetDrawing() {
  isDrawing = false;
  clicks = 0;
  localStart = null;
  localEnd = null;
  raycast.lastPlane = null;
  localLine = null;
}

function newLine() {

}

function onMouseMove(event) {
  if (!isDrawing || !raycast.plane) {
    resetDrawing();
    return;
  }
  if (raycast.lastPlane !== raycast.plane) {
    console.warn("Not on the same plane anymore.");
    resetDrawing();
    return;
  }
  localLine.geometry.setFromPoints([localStart, raycast.localPoint]);
  localLine.geometry.attributes.position.needsUpdate = true;
}

window.addEventListener('mousemove', onMouseMove);

// && which tool
window.addEventListener('mousedown', (e) => {
  // 0 is left button
  if (e.button === 0) {
    drawing();
  } else if (e.button === 2) { 
    // Right click
  }
});

window.addEventListener('mouseup', (e) => {
  // 0 is left button
  if (e.button === 0) {

  }
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    spaceDown = true;
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    spaceDown = false;
    // disables left mouse action
    controls.mouseButtons.LEFT = null;
  }
});

document.getElementById('line-btn').addEventListener('click', () => {
  if (lineTool === false) {  
    console.log('Line tool enabled');
    lineTool = true;
  } else {
    console.log('Line tool disabled');
    lineTool = false;
  }
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
  const xyFocus = new THREE.Vector3(cube.halfPlane, cube.halfPlane, cube.pSize+cube.gap*2);
  setCameraPos(xyFocus);
  setCameraTarget(center);
});
// ZY Red plane camera button
document.getElementById('zyCamera-btn').addEventListener('click', () => {
  const zyFocus = new THREE.Vector3(-cube.pSize-cube.gap*2, cube.halfPlane, -cube.halfPlane);
  setCameraPos(zyFocus);
  setCameraTarget(center);
});
// XZ Blue plane camera button
document.getElementById('xzCamera-btn').addEventListener('click', () => {
  const xzFocus = new THREE.Vector3(cube.halfPlane, -cube.pSize - cube.gap*2, -cube.halfPlane);
  setCameraPos(xzFocus);
  setCameraTarget(center);
});
// AB Pink plane camera button
document.getElementById('abCamera-btn').addEventListener('click', () => {
  const abFocus = new THREE.Vector3(cube.halfPlane, cube.halfPlane, -cube.pSize-cube.gap*2);
  setCameraPos(abFocus);
  setCameraTarget(center);
});
// CB Green plane camera button
document.getElementById('cbCamera-btn').addEventListener('click', () => {
  const cbFocus = new THREE.Vector3(cube.pSize+cube.gap*2, cube.halfPlane, -cube.halfPlane);
  setCameraPos(cbFocus);
  setCameraTarget(center);
});
// AB Orange plane camera button
document.getElementById('acCamera-btn').addEventListener('click', () => {
  const acFocus = new THREE.Vector3(cube.halfPlane, cube.pSize+cube.gap*2, -cube.halfPlane);
  setCameraPos(acFocus);
  setCameraTarget(center);
});
// Return to orbit
document.getElementById('orbit-btn').addEventListener('click', () => {
  resetCamera();
});

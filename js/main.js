import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { runStartupAnimation } from './startupAnimation.js';
import camera from './camera.js';
import { addResizeListener} from './resize.js';
import scene from './scene.js';
import createControls from './controls.js';
import cube from './cube.js';
import { scaleGrids, scaleLabels } from './cube.js';
import raycast from './raycast.js';
import { castRay } from './raycast.js';

import { initMouseListeners } from './mouseListeners.js';
import { initKeyboardListeners } from './keyboardListeners.js';
import { initUIButtons } from './uiButtons.js';

import ToolManager from './tools/ToolManager.js';
import LineTool from './tools/LineTool.js';
import RectangleTool from './tools/RectangleTool.js';

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
let cameraFar = cube.pSize*4 + cube.gap*4 + 500;

camera.zoom = cameraZoom;
camera.near = cameraNear;
camera.far = cameraFar;

// Cube settings
// input number button for cube gap with max and min.

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

// const gui1 = new GUI();
// gui1.add(camera, 'zoom', 1, 30, 1).listen();

const lineManager = {
  lines: [],

  addLine(line, parent) {
    parent.add(line);
    this.lines.push({ line, parent });
  },

  clearLines() {
    this.lines.forEach(({ line, parent }) => {
      parent.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    });
    this.lines = [];
  }
};

const toolManager = new ToolManager();
const lineToolInstance = new LineTool(scene, raycast, lineManager);
const rectangleToolInstance = new RectangleTool(scene, raycast);

initMouseListeners(toolManager);
initKeyboardListeners(controls);

initUIButtons({
  toolManager,
  lineToolInstance,
  rectangleToolInstance,
  cube,
  setCameraPos,
  setCameraTarget,
  resetCamera
});

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
import * as THREE from 'three';

// Shared pieces
import createRenderer from './renderer.js';
import scene from './scene.js';
import Camera from './Camera.js';
import createControls from './controls.js';
import cube from './cube.js';
import raycast, { castRay } from './raycast.js';

import { runStartupAnimation } from './startupAnimation.js';

// Utility
import { setupSettings } from './settings.js';
import { addResizeListener} from './resize.js';
import { initListeners } from './listeners.js';
import { initUIButtons } from './uiButtons.js';

// Shaders for grid
import vertexShader from '../shaders/grid.vert.glsl';
import fragmentShader from '../shaders/grid.frag.glsl';

// Tools
import ToolManager from './tools/ToolManager.js';
import LineTool from './tools/LineTool.js';
import RectangleTool from './tools/RectangleTool.js';

import { app } from './app.js';

import Build from './Build.js';

let renderer, camera, controls;
let center, defaultOrbit;

// White background
let background = new THREE.Color(0xffffff);

// Camera settings
let cameraZoom, cameraFar, frustrumSize;

// Cube settings
// input number button for cube gap with max and min.

// origin axeshelper
const origin = new THREE.AxesHelper(cube.pSize);
origin.position.set(0,0,0);
scene.add(origin);

// const inverse = new THREE.AxesHelper(cube.pSize);
// inverse.position.set(cube.pSize, 0, cube.pSize);
// inverse.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
// scene.add(inverse);

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);

// Where 2D drawings and 3D objects are stored
let build;

let toolManager, lineToolInstance, rectangleToolInstance;

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
    
  renderer = createRenderer();

  // Set camera position and orientation;
  // Center of cube
  center = new THREE.Vector3(cube.halfPlane, cube.halfPlane, -cube.halfPlane);
  defaultOrbit = new THREE.Vector3(-cube.pSize-cube.gap, cube.pSize*2+cube.gap, cube.pSize+cube.gap);

  cameraZoom = 4.4 / cube.pSize;
  cameraFar = cube.pSize*4 + cube.gap*4 + 500;

  // camera
  camera = new Camera(defaultOrbit, center, cameraFar);

  // Orbit controls
  controls = createControls(camera, renderer);
  camera.attachControls(controls);

  camera.setPos(defaultOrbit);
  camera.setTarget(center);
  camera.zoom = cameraZoom;
  
  // Disable left mouse button
  // hold space to use left mouse to pan
  controls.mouseButtons.LEFT = null;

  // Prepare 3D build box
  build = new Build(cube.planes, cube.pSize);
  
  // tools
  toolManager = new ToolManager();
  lineToolInstance = new LineTool(scene, raycast, build.sketches);
  rectangleToolInstance = new RectangleTool(scene, raycast);

  // Inject into appContext
  app.renderer = renderer;
  app.scene = scene;
  app.camera = camera;
  app.controls = controls;
  app.raycast = raycast;
  app.cube = cube;
  app.build = build;

  // Position camera and zoom
  app.camera.refresh();

  // Dynamic resizing of window
  addResizeListener(app.camera, frustrumSize, app.renderer);

  // Ready settings
  setupSettings();

  // Set up listeners
  initListeners(toolManager, controls, lineToolInstance);
  // Set up UI logic
  initUIButtons({
    toolManager,
    lineToolInstance,
    rectangleToolInstance,
    cube
  });

  // Add the CAD cube to scene
  scene.add(app.cube);
  // Add the build box
  scene.add(app.build);

  // Check axis of planes
  //const axis = new THREE.AxesHelper(10000);
  //app.cube.cbGroup.add(axis);
}

function animate () {
  // Update label and grid scale
  app.cube.scaleGuides(app.camera.zoom);
  
  // Adjust grid spacing based on zoom level
  app.cube.updateGridSpacing(renderer, camera);
  camera.updateProjectionMatrix();

  // from raycast.js
  castRay();

  controls.update();
  renderer.render(scene, camera);

  // tells browser to perform animation
  requestAnimationFrame(animate);
}
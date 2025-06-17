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

// Tools
import ToolManager from './tools/ToolManager.js';
import LineTool from './tools/LineTool.js';
import RectangleTool from './tools/RectangleTool.js';

// application shared state manager
import { app } from './app.js';

// 2d sketches and 3d objects
import Build from './Build.js';

let renderer, camera, controls;
let center, defaultOrbit;

// White background
let background = new THREE.Color(0xffffff);

const canvas = document.querySelector('#background');

// Camera settings
let cameraZoom, cameraFar, frustrumSize;

// Cube settings
// input number button for cube gap with max and min.

// origin axeshelper
const origin = new THREE.AxesHelper(cube.pSize);
origin.position.set(0,0,0);
scene.add(origin);

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);

// Where 2D drawings and 3D objects are stored
let build;

// Tools
let toolManager, lineToolInstance, rectangleToolInstance;

init();
animate();

function init () {
  scene.background = background;

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
  // set camera
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
  lineToolInstance = new LineTool(scene, raycast, cube, build);
  rectangleToolInstance = new RectangleTool(scene, raycast, cube, build);

  // Inject into appContext
  app.renderer = renderer;
  app.scene = scene;
  app.camera = camera;
  app.controls = controls;
  app.raycast = raycast;
  app.cube = cube;
  app.build = build;

  // update camera
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
  app.scene.add(app.cube);
  // Add the build box
  app.scene.add(app.build);

  // Add lights for 3d object
  // Ambient light for base visibility
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  // Directional light like a headlight
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(app.cube.pSize, app.cube.pSize, -app.cube.pSize);
  scene.add(light);

  // Optional: camera-attached headlight
  camera.add(new THREE.DirectionalLight(0xffffff, 0.5));


  // Check axis of planes
  //const axis = new THREE.AxesHelper(10000);
  //app.cube.cbGroup.add(axis);
}

function animate () {
  // Update label and grid scale
  app.cube.scaleGuides(app.renderer, app.camera);

  // from raycast.js
  castRay();

  app.controls.update();
  app.camera.updateProjectionMatrix();
  app.renderer.render(app.scene, app.camera);

  // tells browser to perform animation
  requestAnimationFrame(animate);
}
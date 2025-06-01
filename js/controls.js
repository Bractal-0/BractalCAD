import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { app } from './app.js';

export default function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;

  // Settings
  controls.zoomSpeed = 1;
  controls.rotateSpeed = 0.5;

  // Remap mouse buttons
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };

  // Remap touch gestures
  controls.touches = {
    ONE: THREE.TOUCH.PAN,
    TWO: THREE.TOUCH.ROTATE
  };

  return controls;
}

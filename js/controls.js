import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.zoomSpeed = 3;

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
  // Optionally, restrict zoom distance for orthographic camera
  //controls.minZoom = 0.5;
  //controls.maxZoom = 5;

  // For orthographic camera: scale grid inversely to camera zoom
  // const scale = 0.5 / camera.zoom;
  // cubeGroup.scale.set(scale, scale, scale);

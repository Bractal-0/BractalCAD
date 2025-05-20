import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.zoomSpeed = 3;

  // Optionally, restrict zoom distance for orthographic camera
  //controls.minZoom = 0.5;
  //controls.maxZoom = 5;

  // For orthographic camera: scale grid inversely to camera zoom
  // const scale = 0.5 / camera.zoom;
  // gridsGroup.scale.set(scale, scale, scale);
  
  return controls;
}

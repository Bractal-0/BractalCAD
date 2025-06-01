import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const frustrumSize = 50;

// Will need to set zoomscale, zoom, and far to
// taking user input for grid size.
const camera = new THREE.OrthographicCamera(
  -aspect * frustrumSize / 2,
   aspect * frustrumSize / 2,
   frustrumSize / 2,
  -frustrumSize / 2,
  0.01,
  100
);

camera.frustumSize = frustrumSize;
camera.updateProjectionMatrix();

export {camera as default, frustrumSize};
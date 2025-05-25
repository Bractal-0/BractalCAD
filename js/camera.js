import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const frustrumSize = 10;

// Will need to set zoomscale, zoom, and far to
// taking user input for grid size.
const camera = new THREE.OrthographicCamera(
  -aspect * frustrumSize / 2,
   aspect * frustrumSize / 2,
   frustrumSize / 2,
  -frustrumSize / 2,
  0.1,
  1000
);

export default camera;
import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const zoomScale = 1000;

// Will need to set zoomscale, zoom, and far to
// taking user input for grid size.
const camera = new THREE.OrthographicCamera(
  -aspect * zoomScale / 2,
   aspect * zoomScale / 2,
   zoomScale / 2,
  -zoomScale / 2,
  0.1,
  2000
);

export default camera;
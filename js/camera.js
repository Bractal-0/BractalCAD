import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const zoomScale = 1000;
const camera = new THREE.OrthographicCamera(
  -aspect * zoomScale / 2,
   aspect * zoomScale / 2,
   zoomScale / 2,
  -zoomScale / 2,
  0.1,
  1000
);

camera.position.set(500, 500, 500);
camera.lookAt(0, 0, 0);
camera.zoom = 3;
camera.updateProjectionMatrix();

export default camera;
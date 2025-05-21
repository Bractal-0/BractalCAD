import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const d = 50;
const camera = new THREE.OrthographicCamera(
  -d * aspect, d * aspect, d, -d, -10000, 10000
);

// Camera is like the eye of the viewer
// 75 degrees, aspect ratio of users browser window, near and far clipping planes (view frustrum))
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// orthographic camera

camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);

export default camera;
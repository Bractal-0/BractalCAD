import * as THREE from 'three';

export default function createRenderer() {
  const canvas = document.querySelector('#background');

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  return renderer;
}

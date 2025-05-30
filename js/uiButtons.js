// uiButtons.js
import * as THREE from 'three';
import { toggleGrids } from './cube.js';

export function initUIButtons({
  toolManager,
  lineToolInstance,
  rectangleToolInstance,
  cube,
  setCameraPos,
  setCameraTarget,
  resetCamera
}) {
  const lineBtn = document.getElementById('line-btn');
  const rectBtn = document.getElementById('rectangle-btn');

  lineBtn.addEventListener('click', () => {
    toolManager.setTool(lineToolInstance);
    updateToolUI();
  });

  rectBtn.addEventListener('click', () => {
    toolManager.setTool(rectangleToolInstance);
    updateToolUI();
  });

  function updateToolUI() {
    lineBtn.classList.toggle('active', toolManager.activeTool === lineToolInstance);
    rectBtn.classList.toggle('active', toolManager.activeTool === rectangleToolInstance);
  }

  // Fullscreen
  document.getElementById('fullscreen-btn').addEventListener('click', () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
      elem.requestFullscreen?.() || elem.webkitRequestFullscreen?.() || elem.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
    }
  });

  // Toggle grid
  document.getElementById('toggle-grid-btn').addEventListener('click', () => {
    toggleGrids();
  });

  // Camera buttons
  const half = cube.halfPlane;
  const size = cube.pSize;
  const gap = cube.gap;

  const camButtons = {
    'xyCamera-btn': new THREE.Vector3(half, half, size + gap * 2),
    'zyCamera-btn': new THREE.Vector3(-size - gap * 2, half, -half),
    'xzCamera-btn': new THREE.Vector3(half, -size - gap * 2, -half),
    'abCamera-btn': new THREE.Vector3(half, half, -size - gap * 2),
    'cbCamera-btn': new THREE.Vector3(size + gap * 2, half, -half),
    'acCamera-btn': new THREE.Vector3(half, size + gap * 2, -half)
  };

  for (const [id, pos] of Object.entries(camButtons)) {
    document.getElementById(id).addEventListener('click', () => {
      setCameraPos(pos);
      setCameraTarget(new THREE.Vector3(half, half, -half));
    });
  }

  // Reset camera
  document.getElementById('center-btn').addEventListener('click', () => {
    resetCamera();
  });
}

// Lock rotation function
//  Might need to adjust for top and bottom planes
function lockRotation() {
  controls.enableRotate = false;
  refreshConCam();
}

function unlockRotation() {
  controls.enableRotate = true;
  refreshConCam();
}

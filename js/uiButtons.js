import * as THREE from 'three';
import { app } from './app.js';

export function initUIButtons({
  toolManager,
  lineToolInstance,
  rectangleToolInstance,
  cube
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

  // Toggle all planes
  const checkPlanes = document.getElementById('toggle-all-planes');

  checkPlanes.addEventListener('change', () => {
    app.cube.toggleAllPlanes(checkPlanes.checked);
  });

  // Toggle plane
  //const planeName = this.planes[i].name;
  //const toggle = "toggle-" + planeName;
  
  //const plane = document.getElementById(toggle);

  // Toggle grids
  const checkGrids = document.getElementById('toggle-grids');

  checkGrids.addEventListener('change', () => {
    app.cube.toggleGrids(checkGrids.checked);
  });

  // Toggle borders
  const checkBorders = document.getElementById('toggle-borders');

  checkBorders.addEventListener('change', () => {
    app.cube.toggleBorders(checkBorders.checked);
  });

  // Camera buttons
  const half = app.cube.halfPlane;
  const size = app.cube.pSize;
  const gap = app.cube.gap;

  const camButtons = {
    'xyCamera-btn': new THREE.Vector3(half, half, size*2),
    'zyCamera-btn': new THREE.Vector3(-size*2, half, -half),
    'xzCamera-btn': new THREE.Vector3(half, -size*2, -half+0.0001),
    'abCamera-btn': new THREE.Vector3(half, half, -size*3),
    'cbCamera-btn': new THREE.Vector3(size*3, half, -half),
    'acCamera-btn': new THREE.Vector3(half, size*3, -half+0.0001)
  };

  for (const [id, pos] of Object.entries(camButtons)) {
    document.getElementById(id).addEventListener('click', () => {
      app.camera.setPos(pos);
      app.camera.setTarget(new THREE.Vector3(half, half, -half));
    });
    app.camera.refresh();
  }

  // Reset camera
  document.getElementById('center-btn').addEventListener('click', () => {
    app.camera.reset();
  });
}

// Lock rotation function
//  Might need to adjust for top and bottom planes
function lockRotation() {
  controls.enableRotate = false;
  app.camera.refresh();
}

function unlockRotation() {
  controls.enableRotate = true;
  app.camera.refresh();
}

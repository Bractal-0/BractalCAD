import * as THREE from 'three';
import { app } from './app.js';

export function initListeners(toolManager, controls, lineTool) {

  // Start panning
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { app.spaceDown = true; }
  });

  // stop panning
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') { app.spaceDown = false; }
  });

  app.renderer.domElement.addEventListener('pointerup', (e) => {
    app.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  });

  // To stop drawing
  window.addEventListener('keydown', (e) => {
    if (!lineTool.isDrawing) return;

    if (e.key === 'Escape') {
      lineTool.finalise(); // Cancel and finish drawing
    }
  });

  // Mouse listeners
  window.addEventListener('pointermove', (e) => {
    toolManager.onPointerMove(e);
  });

  window.addEventListener('pointerdown', (e) => {

    if (e.target.closest('.menu')) return; // ignore clicks inside menu

    if (!app.spaceDown) {
      toolManager.onPointerDown(e);
    }
  });

  window.addEventListener('pointerup', (e) => {
    toolManager.onPointerUp(e);
  });

}

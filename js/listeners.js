import * as THREE from 'three';

export function initListeners(toolManager, controls, lineTool) {
  let spaceDown = false;

  // Start panning
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spaceDown) {
      spaceDown = true;
      controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    }
  });

  // stop panning
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      spaceDown = false;
 
      controls.mouseButtons.LEFT = null; // disable left mouse button
    }
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
    
    if (e.target.closest('#menu')) return; // ignore clicks inside menu

    if (!spaceDown) {
      toolManager.onPointerDown(e);
    }
  });

  window.addEventListener('pointerup', (e) => {
    toolManager.onPointerUp(e);
  });

}

import * as THREE from 'three';

export function initKeyboardListeners(controls) {
  let spaceDown = false;

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spaceDown) {
      spaceDown = true;
      controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      spaceDown = false;
      controls.mouseButtons.LEFT = null; // disable left mouse button
    }
  });
}

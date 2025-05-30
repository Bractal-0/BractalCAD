// mouseListeners.js
export function initMouseListeners(toolManager) {
  window.addEventListener('mousemove', (e) => {
    toolManager.onMouseMove(e);
  });

  window.addEventListener('mousedown', (e) => {
    toolManager.onMouseDown(e);
  });

  window.addEventListener('mouseup', (e) => {
    toolManager.onMouseUp(e);
  });
}

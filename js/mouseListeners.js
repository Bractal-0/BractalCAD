// mouseListeners.js
export function initMouseListeners(toolManager) {
  // => is an arrow function, shorthand for function (e) {}
  // Inherits (this.) from surrounding scope.
  // Useful for inline callbacks like events.
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

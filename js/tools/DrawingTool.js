// tools/DrawingTool.js
export default class DrawingTool {
  constructor(scene, raycast) {
    this.scene = scene;
    this.raycast = raycast;

    this.enabled = false;
    this.isDrawing = false;
    this.clicks = 0;
    this.activePlane = null;
    this.localStart = null;
  }

  enable() {
    this.enabled = true;
    this.reset();
  }

  disable() {
    this.enabled = false;
    this.reset();
  }

  toggle() {
    this.enabled = !this.enabled;
    this.reset();
  }

  // Child classes must override these
  onMouseMove() {}
  draw() {}
  reset() {}
}

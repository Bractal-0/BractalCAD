import * as THREE from 'three';
import DrawingTool from './DrawingTool.js';

export default class LineTool extends DrawingTool {
  constructor(scene, raycast, lineManager) {
    super(scene, raycast);
    this.lineManager = lineManager;
    this.tempLine = null;

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      linewidth: 2,
      opacity: 1,
      polygonOffset: true,
      polygonOffsetFactor: -1,  // pull closer to camera
      polygonOffsetUnits: -1
    });
  }

  onMouseMove() {
    if (!this.enabled || !this.isDrawing || !this.activePlane || !this.tempLine) return;

    this.tempLine.geometry.setFromPoints([
      this.localStart,
      this.raycast.localPoint
    ]);
    this.tempLine.geometry.attributes.position.needsUpdate = true;
  }

  draw() {
    if (!this.enabled || !this.raycast.plane) {
      this.reset();
      return;
    }

    if (this.clicks === 0) {
      this.clicks++;
      this.isDrawing = true;
      this.activePlane = this.raycast.plane;
      this.localStart = this.activePlane.worldToLocal(this.raycast.point.clone());

      const geometry = new THREE.BufferGeometry().setFromPoints([
        this.localStart,
        this.localStart.clone()
      ]);
      this.tempLine = new THREE.Line(geometry, this.lineMaterial);
      this.activePlane.add(this.tempLine);
    } else if (this.clicks === 1 && this.raycast.plane === this.activePlane) {
      const finalLine = new THREE.Line(this.tempLine.geometry.clone(), this.lineMaterial);
      this.lineManager.addLine(finalLine, this.activePlane);
      this.reset();
    }
  }

  reset() {
    this.isDrawing = false;
    this.clicks = 0;

    if (this.tempLine && this.activePlane) {
      this.activePlane.remove(this.tempLine);
      this.tempLine.geometry.dispose();
    }

    this.tempLine = null;
    this.activePlane = null;
  }
}

import * as THREE from 'three';
import DrawingTool from './DrawingTool.js';
import Build from '/js/Build.js';

export default class LineTool extends DrawingTool {
  constructor(scene, raycast, sketches) {
    super(scene, raycast);
    this.sketches = sketches;

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      linewidth: 2,
      opacity: 1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });

    this.tempLine = null;
    this.points = [];

    this.activePlane = raycast.plane;
  }

  onMouseMove() {
    if (
      !this.enabled ||
      !this.isDrawing ||
      !this.activePlane ||
      !this.tempLine ||
      !this.raycast.point
    ) return;

    const localPoint = this.activePlane.worldToLocal(this.raycast.point.clone());

    // Update the last point to follow mouse
    const updatedPoints = [...this.points, localPoint];
    this.tempLine.geometry.dispose();
    this.tempLine.geometry = new THREE.BufferGeometry().setFromPoints(updatedPoints);

  }

  draw() {
    if (!this.enabled || !this.raycast.plane) {
      // if clicked out of plane to cancel preview,
      // still finish what lines were drawn.
      if (this.activePlane) {
        this.finalise();
      }
      this.reset();
      return;
    }

    const clickedPlane = this.raycast.plane;
    const localPoint = clickedPlane.worldToLocal(this.raycast.point.clone());

    if (!this.isDrawing) {
      // Start new polyline
      this.isDrawing = true;
      this.activePlane = clickedPlane;
      this.points = [localPoint];

      const geometry = new THREE.BufferGeometry().setFromPoints([localPoint, localPoint.clone()]);
      this.tempLine = new THREE.Line(geometry, this.lineMaterial);
      this.activePlane.add(this.tempLine);

    } else if (clickedPlane === this.activePlane) {
      // Add another segment
      this.points.push(localPoint);

      const updatedPoints = [...this.points, localPoint.clone()];
      this.tempLine.geometry.dispose();
      this.tempLine.geometry = new THREE.BufferGeometry().setFromPoints(updatedPoints);

    }
  }

  // Call this manually to end drawing and store the final line
  finalise() {
    if (this.tempLine && this.points.length >= 1) {
      const finalGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
      const finalLine = new THREE.Line(finalGeometry, this.lineMaterial.clone());
      this.sketches.addSketch(finalLine, this.activePlane);
    }
    this.reset();
  }

  reset() {
    this.isDrawing = false;
    this.points = [];

    if (this.tempLine && this.activePlane) {
      this.activePlane.remove(this.tempLine);
      this.tempLine.geometry.dispose();
    }

    this.tempLine = null;
    this.activePlane = null;
  }
}

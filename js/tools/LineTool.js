import * as THREE from 'three';
import DrawingTool from './DrawingTool.js';
import { app } from "/js/app.js";

export default class LineTool extends DrawingTool {
  constructor(scene, raycast, cube, build) {
    super(scene, raycast);
    this.cube = cube;
    this.build = build;

    // Snap interval
    this.gridSize = 1;

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

    let localPoint = this.activePlane.worldToLocal(this.raycast.point.clone());
    localPoint = this.snapToGrid(localPoint);

    // Update the last point to follow mouse
    const updatedPoints = [...this.points, localPoint];
    this.tempLine.geometry.dispose();
    this.tempLine.geometry = new THREE.BufferGeometry().setFromPoints(updatedPoints);

  }

  draw() {
    if (!this.enabled || !this.raycast.object) {
      // if clicked out of plane to cancel preview,
      // still finish what lines were drawn.
      if (this.activePlane) {
        this.finalise();
      }
      this.reset();
      return;
    }

    const intersected = this.raycast.object;

    // Custom test: is this a draw plane?
    if (!intersected.userData.isDrawPlane) {
      this.finalise();
      this.reset();
      return;
    }

    const clickedPlane = intersected;
    let localPoint = clickedPlane.worldToLocal(this.raycast.point.clone());
    localPoint = this.snapToGrid(localPoint);

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
    if (this.tempLine && this.points.length > 1) {
      const finalGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
      const finalLine = new THREE.Line(finalGeometry, this.lineMaterial.clone());
      this.build.addSketch(finalLine, this.activePlane);
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

  get currentGridSpacing() {
    return this.cube.gridSpacing;
  }

  // Snap line vertices to grid points
  snapToGrid(vector) {
    const spacing = this.currentGridSpacing;
    const snapped = vector.clone();
    snapped.x = Math.round(snapped.x / spacing) * spacing;
    snapped.y = Math.round(snapped.y / spacing) * spacing;
    snapped.z = Math.round(snapped.z / spacing) * spacing;
    return snapped;
  }
}

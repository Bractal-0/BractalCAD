import * as THREE from 'three';
import { app } from './app.js';

import gridVertexShader from '../shaders/grid.vert.glsl';
import gridFragmentShader from '../shaders/grid.frag.glsl';

// Super Cube
export class SuperCube extends THREE.Group {
  constructor() {
    super();

    // Planes
    this.pSize = 10;
    this.gapScale = 0;
    this.gap = this.pSize * this.gapScale;
    this.halfPlane = this.pSize/2;
    this.griddivs = 20;
    this.planeOpacity = 1;
    // Grids
    this.gridMaterial = null;
    this.gridOpacity = 0.6;
    // 20 pixels between grid points on screen
    this.targetPixelSpacing = 20;
    this.pixelsPerWorldUnit;
    this.rawSpacing;
    // Borders
    this.borderScale = 0.1;
    this.borderWidth = this.pSize * this.borderScale;
    this.borderSize = this.pSize + this.borderWidth*2;
    this.halfOuter = this.halfPlane + this.borderWidth;
    this.borderColour = 0xffffff;
    this.borderOpacity = 0.7;
    // Axis labels
    this.labelScale = 0.2; // 0.2 is good
    this.labelSize = 10 * this.labelScale;
    this.labelOffset = this.gap + this.borderWidth + (this.pSize*0.1);
    // Inner build box
    this.buildBox = null;

    this.planeGeometry = null;
    this.planeMaterial = null;
    
    // Planes
    this.xyPlane = null;
    this.zyPlane = null;
    this.xzPlane = null;
    this.abPlane = null;
    this.cbPlane = null;
    this.acPlane = null;

    // Grids
    this.xyGrid = null;
    this.zyGrid = null;
    this.xzGrid = null;
    this.abGrid = null;
    this.cbGrid = null;
    this.acGrid = null;

    // Borders
    this.xyBorder = null;
    this.zyBorder = null;
    this.xzBorder = null;
    this.abBorder = null;
    this.cbBorder = null;
    this.acBorder = null;

    //Outlines
    this.outerPoints = null;
    this.xyOutline = null;
    this.zyOutline = null;
    this.xzOutline = null;
    this.abOutline = null;
    this.cbOutline = null;
    this.acOutline = null;

    // Groups
    this.groupSet = null;
    this.xyGroup = null;
    this.zyGroup = null;
    this.xzGroup = null;
    this.abGroup = null;
    this.cbGroup = null;
    this.acGroup = null;
    
    // Border Outlines
    this.xyOutline = null;
    this.zyOutline = null;
    this.xzOutline = null;
    this.abOutline = null;
    this.cbOutline = null;
    this.acOutline = null;

    // For easy reference
    this.groups = {};
    this.planes = {};
    this.colours = {};

    this.init();
  }

  init() {
    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.pSize, this.pSize);
    this.planeMaterial = this.createPlaneMaterial(0xffffff);

    // Colours
    this.colours = {
      xy: 0xFFFF00,  // Yellow
      zy: 0xFF0000,  // Red
      xz: 0x0000FF,  // Blue
      ab: 0xFF5CFF,  // Pink
      cb: 0x008000,  // Green
      ac: 0xFF7518,  // Orange
    };

    // Create planes
    this.xyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.zyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.xzPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.abPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.cbPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.acPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

    // Set plane names
    this.xyPlane.name = 'XY : YELLOW';
    this.zyPlane.name = 'ZY : RED';
    this.xzPlane.name = 'XZ : BLUE';
    this.abPlane.name = 'AB : PINK';
    this.cbPlane.name = 'CB : GREEN';
    this.acPlane.name = 'AC : ORANGE';

    // Grid Material
    this.gridMaterial = new THREE.ShaderMaterial({
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    uniforms: {
      lineThickness: { value: 0.03 },
      u_color: { value: new THREE.Color(0x000000)},
      u_spacing: { value: 20.0 }, // number of lines per unit
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_zoom: { value: 1.0}
    },
    side: THREE.DoubleSide,
    transparent: true,
    opacity: this.gridOpacity,
    depthWrite: false,
    blending: THREE.NoBlending, // allows the grid to blend over the plane
    });

    // Grid shaders
    //applyGridShaderToPlanes(this.grids);

    // Check axis of planes
    //const axis = new THREE.AxesHelper(300);
    //acGroup.add(axis);

    // Grids
    this.xyGrid = this.createGrid();
    this.zyGrid = this.createGrid();
    this.xzGrid = this.createGrid();
    this.abGrid = this.createGrid();
    this.cbGrid = this.createGrid();
    this.acGrid = this.createGrid();

    this.outerPoints = [
      new THREE.Vector3(-this.halfOuter, -this.halfOuter, 0),
      new THREE.Vector3(this.halfOuter, -this.halfOuter, 0),
      new THREE.Vector3(this.halfOuter, this.halfOuter, 0),
      new THREE.Vector3(-this.halfOuter, this.halfOuter, 0),
      new THREE.Vector3(-this.halfOuter, -this.halfOuter, 0)
    ];

    // Plane Borders
    this.xyBorder = this.createBorderStrip(this.colours.xy);
    this.zyBorder = this.createBorderStrip(this.colours.zy);
    this.xzBorder = this.createBorderStrip(this.colours.xz);
    this.abBorder = this.createBorderStrip(this.colours.ab);
    this.cbBorder = this.createBorderStrip(this.colours.cb);
    this.acBorder = this.createBorderStrip(this.colours.ac);

    // Plane edges
    this.xyOutline = this.createOutline();
    this.zyOutline = this.createOutline();
    this.xzOutline = this.createOutline();
    this.abOutline = this.createOutline();
    this.cbOutline = this.createOutline();
    this.acOutline = this.createOutline();

    // Create groups for planes, grids and borders
    this.xyGroup = new THREE.Group();
    this.zyGroup = new THREE.Group();
    this.xzGroup = new THREE.Group();
    this.abGroup = new THREE.Group();
    this.cbGroup = new THREE.Group();
    this.acGroup = new THREE.Group();

    // Add planes to groups
    this.xyGroup.add(this.xyPlane, this.xyGrid, this.xyBorder, this.xyOutline);
    this.zyGroup.add(this.zyPlane, this.zyGrid, this.zyBorder, this.zyOutline);
    this.xzGroup.add(this.xzPlane, this.xzGrid, this.xzBorder, this.xzOutline);
    this.abGroup.add(this.abPlane, this.abGrid, this.abBorder, this.abOutline);
    this.cbGroup.add(this.cbPlane, this.cbGrid, this.cbBorder, this.cbOutline);
    this.acGroup.add(this.acPlane, this.acGrid, this.acBorder, this.acOutline);

    // Add axis labels
    this.xLabel = this.createAxisLabel('X', 0x000000, new THREE.Vector3(this.halfPlane, -this.labelOffset, -this.labelOffset));
    this.yLabel = this.createAxisLabel('Y', 0x000000, new THREE.Vector3(-this.labelOffset, this.halfPlane, -this.labelOffset));
    this.zLabel = this.createAxisLabel('Z', 0x000000, new THREE.Vector3(-this.labelOffset, -this.labelOffset, this.halfPlane));
    // Add labels for A, B, C planes
    this.aLabel = this.createAxisLabel('A', 0x000000, new THREE.Vector3(this.halfPlane, this.pSize+this.labelOffset, this.pSize+this.labelOffset));
    this.bLabel = this.createAxisLabel('B', 0x000000, new THREE.Vector3(this.pSize+this.labelOffset, this.halfPlane, this.pSize+this.labelOffset));
    this.cLabel = this.createAxisLabel('C', 0x000000, new THREE.Vector3(this.pSize+this.labelOffset, this.pSize+this.labelOffset, this.halfPlane));

    this.planes = {
      xy: this.xyPlane,
      zy: this.zyPlane,
      xz: this.xzPlane,
      zb: this.abPlane,
      cb: this.cbPlane,
      ac: this.acPlane
    }

    // map for groups
    // cube.groups.xy
    this.groups = {
      xy: this.xyGroup,
      zy: this.zyGroup,
      xz: this.xzGroup,
      ab: this.abGroup,
      cb: this.cbGroup,
      ac: this.acGroup,
    }

    this.positionGroups();
  
    // Axis labels
    this.labels = {
    x: this.xLabel,
    y: this.yLabel,
    z: this.zLabel,
    a: this.aLabel,
    b: this.bLabel,
    c: this.cLabel}

    // Inner box guide
    const boxA = new THREE.BoxGeometry(this.pSize, this.pSize, this.pSize);
    const edges = new THREE.EdgesGeometry(boxA); // extracts edges
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8 });
    this.buildBox = new THREE.LineSegments(edges, lineMaterial);
    this.buildBox.position.set(this.halfPlane, this.halfPlane, this.halfPlane);
    this.buildBox.renderOrder = 1;

    // Add each group and label explicitly
    Object.values(this.groups).forEach(group => this.add(group));
    Object.values(this.labels).forEach(label => this.add(label));
    this.add(this.buildBox);
  }

  updateGapScale(newGapScale) {
    this.gapScale = newGapScale;
    this.positionGroups();
  }

  positionGroups() {
    // recompute group positions based on `this.gap`
    this.groupSet = {
      xy:    { pos: [this.halfPlane, this.halfPlane, -this.gap-this.borderWidth*1], rot: [0, Math.PI, 0] },
      zy:    { pos: [-this.gap-this.borderWidth*1, this.halfPlane, this.halfPlane], rot: [0, -Math.PI/2, 0] },
      xz:    { pos: [this.halfPlane, -this.gap-this.borderWidth*1, this.halfPlane], rot: [Math.PI/2, 0, 0] },
      ab:    { pos: [this.halfPlane, this.halfPlane ,this.pSize+this.gap+this.borderWidth*1], rot: [0, Math.PI, 0] },
      cb:    { pos: [this.pSize+this.gap+this.borderWidth*1, this.halfPlane, this.halfPlane], rot: [0, Math.PI/2, 0] },
      ac:    { pos: [this.halfPlane, this.pSize+this.gap+this.borderWidth*1, this.halfPlane], rot: [-Math.PI/2, 0, 0] },
    };
    for (const key in this.groups) {
      const { pos, rot } = this.groupSet[key];
      const group = this.groups[key];
      group.position.set(...pos);
      group.rotation.set(...rot);
    }
  }

  scaleGuides(zoom) {
    this.scaleLabels(zoom);
  }

  // Axis label scaling
  scaleLabels(zoom) {
    this.labelScale = this.labelSize / zoom;
    Object.values(this.labels).forEach(label => {
      label.scale.set(this.labelScale, this.labelScale, this.labelScale);
    });
  }

  // Incase option to change plane colours
  createPlaneMaterial(color) {
    return new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: this.planeOpacity,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    depthWrite: false,
    blending: THREE.CustomBlending
    });
  }

  // Create grids
  createGrid() {
    // cloned grid material. Sync grid zooming across planes.
    return new THREE.Mesh(this.planeGeometry, this.gridMaterial.clone());
  }

  createBorderStrip(colour) {
    // Outer frame: covers full plane + border on all sides
    const outer = new THREE.Shape();
    outer.moveTo(-this.halfOuter, -this.halfOuter);
    outer.lineTo(this.halfOuter, -this.halfOuter);
    outer.lineTo(this.halfOuter, this.halfOuter);
    outer.lineTo(-this.halfOuter, this.halfOuter);
    outer.lineTo(-this.halfOuter, -this.halfOuter);

    // Inner hole: matches exact plane dimensions
    const inner = new THREE.Path();
    inner.moveTo(-this.halfPlane, -this.halfPlane);
    inner.lineTo(-this.halfPlane, this.halfPlane);
    inner.lineTo(this.halfPlane, this.halfPlane);
    inner.lineTo(this.halfPlane, -this.halfPlane);
    inner.lineTo(-this.halfPlane, -this.halfPlane);

    outer.holes.push(inner);

    const geometry = new THREE.ShapeGeometry(outer);
    // Transparent: false, opacity: 0.4, depthWrite: false
    // Looks awesome.
    const material = new THREE.MeshBasicMaterial({
      color: colour,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: this.borderOpacity,
      depthWrite: true,
      blending: THREE.NoBlending
    });
    return new THREE.Mesh(geometry, material);
  }

  createOutline() {
    const outlineGeometry = new THREE.BufferGeometry().setFromPoints(this.outerPoints);
    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    return new THREE.LineLoop(outlineGeometry, outlineMaterial);
  }

  // Create Axis labels
  createAxisLabel(text, color, position) {
    const canvas = document.createElement('canvas');
    canvas.style.backgroundColor = 'transparent';
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.4});
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(this.labelSize, this.labelSize, 1); // Adjust size as needed
    sprite.position.copy(position);
    sprite.renderOrder = 1;
    return sprite;
  }

  updateGridSpacing(renderer, camera) {
    const height = renderer.domElement.height;
    const worldHeight = camera.top - camera.bottom;
    const pixelsPerWorldUnit = height / worldHeight;

    const rawSpacing = 20 / pixelsPerWorldUnit;
    const spacing = getRoundedSpacing(rawSpacing);

    this.gridMaterial.uniforms.u_spacing.value = spacing;
  }

}

function getRoundedSpacing(rawSpacing) {
  const steps = [1, 2, 5, 10];
  const base = Math.pow(10, Math.floor(Math.log10(rawSpacing)));
  for (const step of steps) {
    const spacing = base * step;
    if (spacing >= rawSpacing) return spacing;
  }
  return base * 10;
}

export function toggleGrids(scene) {

  if (xyGroup.xyGrid) {
    removeGridsFromGroups(planes, grids);
  } else {
    // Add cube to groups
    addGridsToGroups(planes, grids);
  }
}

function addGridsToGroups(groups, grids) {
  for (let i = 0; i < groups.length; i++) {
    groups[i].add(grids[i]);
  }
}

function removeGridsFromGroups(groups, grids) {
  for (let i = 0; i < groups.length; i++) {
    groups[i].remove(grids[i]);
  }
}

// Adaptive grid spacing (purely visual)
// Independent of zoom level, camera, or grid.
// All measurements, drawings, and constraints obey the same consistent unit system.


// Shraed singleton
const cube = new SuperCube();
export default cube
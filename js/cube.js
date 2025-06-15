import * as THREE from 'three';
import { app } from './app.js';

import gridVertexShader from '../shaders/grid.vert.glsl';
import gridFragmentShader from '../shaders/grid.frag.glsl';
import { cloneUniforms } from 'three/src/renderers/shaders/UniformsUtils.js';

// Super Cube
export class SuperCube extends THREE.Group {
  constructor() {
    super(); 

    // Planes
    this.pSize = 1000;
    this.gapScale = 0;
    this.gap = this.pSize * this.gapScale;
    this.halfPlane = this.pSize/2;
    this.griddivs = 20;
    this.planeOpacity = 0;
    // Grids
    this.gridMaterial = null;
    this.gridOpacity = 0.2;
    this._gridSpacing = 10;
    // 20 pixels between grid points on screen
    this.targetPixelSpacing = 20;
    this.pixelsPerWorldUnit;
    this.rawSpacing;
    // Borders
    this.borderScale = 0.02;
    this.borderWidth = this.pSize * this.borderScale;
    this.borderSize = this.pSize + this.borderWidth*2;
    this.halfOuter = this.halfPlane + this.borderWidth;
    this.borderOpacity = 0.6;
    // Axis labels
    this.labelSize = 0.4;
    this.labelOffset = this.gap + this.borderWidth + (this.pSize*0.1);
    // Inner build box
    this.buildBox = null;

    this.planeGeometry = null;
    this.planeMaterial = null;

    this.isDrawPlane = false;
    
    // Planes
    this.xyPlane = null;
    this.zyPlane = null;
    this.xzPlane = null;
    this.abPlane = null;
    this.cbPlane = null;
    this.acPlane = null;

    // Grids
    this.orientA = 0;
    this.orientB = 1;
    this.orientC = 2;
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
    this.groups = [];
    this.planes = [];
    this.colours = [];
    this.borders = [];
    this.labels = [];

    this.init();
  }

  init() {
    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.pSize, this.pSize);
    this.planeGeometry.translate(this.pSize/2, this.pSize/2, 0);

    this.planeMaterial = this.createPlaneMaterial(0xffffff);

    // Colours
    this.colours = {
      xy: 0xFF0000,  // Red
      zy: 0xFFFF00,  // Yllow
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

    this.xyPlane.userData.isDrawPlane = true;
    this.zyPlane.userData.isDrawPlane = true;
    this.xzPlane.userData.isDrawPlane = true;
    this.abPlane.userData.isDrawPlane = true;
    this.cbPlane.userData.isDrawPlane = true;
    this.acPlane.userData.isDrawPlane = true;

    // Set plane names
    this.xyPlane.name = 'XY';
    this.zyPlane.name = 'ZY';
    this.xzPlane.name = 'XZ';
    this.abPlane.name = 'AB';
    this.cbPlane.name = 'CB';
    this.acPlane.name = 'AC';

    this.baseUniforms = {
      u_plane: { value: 0 },
      u_color: { value: new THREE.Color(0x000000) },
      u_spacing: { value: 1.0 },
      opacity: { value: this.gridOpacity },
      u_viewportHeight: { value: 1 },
      u_cameraHeight: { value: 1 },
      u_zoom: { value: 1 },
      u_lineThicknessPixels: { value: 1 }, // desired thickness in pixels for minor lines
      u_majorLineThicknessPixels: { value: 1 }
    };

    // Grids
    this.xyGrid = this.createGrid(1);
    this.zyGrid = this.createGrid(2);
    this.xzGrid = this.createGrid(0);
    this.abGrid = this.createGrid(1);
    this.cbGrid = this.createGrid(2);
    this.acGrid = this.createGrid(0);

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

    this.planes = [
      this.xyPlane,
      this.zyPlane,
      this.xzPlane,
      this.abPlane,
      this.cbPlane,
      this.acPlane
    ]

    this.grids = [
      this.xyGrid,
      this.zyGrid,
      this.xzGrid,
      this.abGrid,
      this.cbGrid,
      this.acGrid
    ]

    this.borders = [
      this.xyBorder,
      this.zyBorder,
      this.xzBorder,
      this.abBorder,
      this.cbBorder,
      this.acBorder
    ]

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
    this.labels = [
      this.xLabel,
      this.yLabel,
      this.zLabel,
      this.aLabel,
      this.bLabel,
      this.cLabel
    ]

    // Add each group and label explicitly
    Object.values(this.groups).forEach(group => this.add(group));
    this.labels.forEach(label => this.add(label));
  }

  updateGapScale(newGapScale) {
    this.gapScale = newGapScale;
    this.positionGroups();
  }

    positionGroups() {
    this.groupSet = {
      xy:    { pos: [0, 0, -this.gap-this.borderWidth*1], rot: [0, 0, 0] },
      zy:    { pos: [-this.gap-this.borderWidth*1, 0, this.pSize], rot: [0, Math.PI/2, 0] },
      xz:    { pos: [0, -this.gap-this.borderWidth*1, 0], rot: [Math.PI/2, 0, 0] },
      ab:    { pos: [0, 0,this.pSize+this.gap+this.borderWidth*1], rot: [0, 0, 0] },
      cb:    { pos: [this.pSize+this.gap+this.borderWidth*1, 0, this.pSize], rot: [0, Math.PI/2, 0] },
      ac:    { pos: [0, this.pSize+this.gap+this.borderWidth*1, 0], rot: [Math.PI/2, 0, 0] },
    };
    for (const key in this.groups) {
      const { pos, rot } = this.groupSet[key];
      const group = this.groups[key];
      group.position.set(...pos);
      group.rotation.set(...rot);
    }
  }

  // positionGroups() {
  //   this.groupSet = {
  //     xy:    { pos: [this.halfPlane, this.halfPlane, -this.gap-this.borderWidth*1], rot: [0, 0, 0] },
  //     zy:    { pos: [-this.gap-this.borderWidth*1, this.halfPlane, this.halfPlane], rot: [0, Math.PI/2, 0] },
  //     xz:    { pos: [this.halfPlane, -this.gap-this.borderWidth*1, this.halfPlane], rot: [Math.PI/2, 0, 0] },
  //     ab:    { pos: [this.halfPlane, this.halfPlane ,this.pSize+this.gap+this.borderWidth*1], rot: [0, 0, 0] },
  //     cb:    { pos: [this.pSize+this.gap+this.borderWidth*1, this.halfPlane, this.halfPlane], rot: [0, Math.PI/2, 0] },
  //     ac:    { pos: [this.halfPlane, this.pSize+this.gap+this.borderWidth*1, this.halfPlane], rot: [Math.PI/2, 0, 0] },
  //   };
  //   for (const key in this.groups) {
  //     const { pos, rot } = this.groupSet[key];
  //     const group = this.groups[key];
  //     group.position.set(...pos);
  //     group.rotation.set(...rot);
  //   }
  // }

  scaleGuides(renderer, camera) {
    this.scaleLabels(camera.zoom);
    this.updateGridSpacing(renderer, camera);
  }

  // Axis label scaling
  scaleLabels(zoom) {
    this.labelScale = this.labelSize / zoom;
    this.labels.forEach(label => {
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

  // Deep clone all uniforms, including nested values
  cloneUniforms(uniforms) {
    return THREE.UniformsUtils.clone(uniforms);
  }

  // Create grids
  createGrid(planeIndex) {
    const uniforms = cloneUniforms(this.baseUniforms);
    uniforms.u_plane.value = planeIndex;

    const material = new THREE.ShaderMaterial({
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      uniforms: uniforms,
      transparent: true,
      opacity: this.gridOpacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1, // Push it slightly forward
      polygonOffsetUnits: -1
    });

    return new THREE.Mesh(this.planeGeometry, material);
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
    // translate local origin to match planes
    geometry.translate(this.pSize/2, this.pSize/2, 0);
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
    // Translate local origin to match planes.
    outlineGeometry.translate(this.pSize/2, this.pSize/2, 0);
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
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.4 });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(this.labelSize, this.labelSize, 1); // Adjust size as needed
    sprite.position.copy(position);
    sprite.renderOrder = 1;
    return sprite;
  }

  get gridSpacing() {
    return this._gridSpacing;
  }

  updateGridSpacing(renderer, camera) {
    // Orthographic camera
    const height = renderer.domElement.height;
    const cameraHeight = (camera.top - camera.bottom) / camera.zoom;
    
    // compute grid spacing as before
    const pixelsPerWorldUnit = height / cameraHeight;
    const rawSpacing = 20 / pixelsPerWorldUnit;

    let spacing = getRoundedSpacing(rawSpacing);
    spacing = Math.max(spacing, 0.5); // minimum spacing

    this._gridSpacing = spacing;

    for (const grid of this.grids) {
      const mat = grid.material.uniforms;

      mat.u_spacing.value = spacing;
      mat.u_viewportHeight.value = height;
      mat.u_cameraHeight.value = camera.top - camera.bottom;  // without zoom
      mat.u_zoom.value = camera.zoom;

      // line thicknesses
      mat.u_lineThicknessPixels.value = 0.01;
      mat.u_majorLineThicknessPixels.value = 0.5;
    }
    // Clamp spacing to a minimum to stop zooming-in effect
    // 0.5 mm if 1 unit = 1 mm.
    // 0.0005 for 1 unit = 1 meter

    //console.log('spacing: ', spacing);
  }
}

function getRoundedSpacing(rawSpacing) {
  const steps = [1, 2, 5, 10, 20];
  const base = Math.pow(10, Math.floor(Math.log10(rawSpacing)));
  for (let step of steps) {
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

const cube = new SuperCube();
export default cube;
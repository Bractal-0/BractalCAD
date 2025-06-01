import * as THREE from 'three';
import { app }from './app.js';

import gridVertexShader from '../shaders/grid.vert.glsl';
import gridFragmentShader from '../shaders/grid.frag.glsl';

// Plane geometry
let pSize = 10;
let halfPlane = pSize/2;
let griddivs = 20;
 
let gapScale = 0.5;
// cube gap
let gap = pSize * gapScale;

let labelScale = 0.2; // 0.2 is good
let labelSize = 10 * labelScale;
let labelOffset = gap + 1;

// 20 pixels between grid points on screen
let targetPixelSpacing = 20;
let pixelsPerWorldUnit;
let rawSpacing;

const xyColour = 0xFFFF00;  // Yellow
const zyColour = 0xFF0000;  // Red
const xzColour = 0x0000FF;  // Blue
const abColour = 0xFF5CFF;  // Pink
const cbColour = 0x008000;  // Green
const acColour = 0xFF7518;  // Orange

let planeOpacity = 0.7;


let borderWidth = 5;
let borderSize = pSize + borderWidth*2;
let halfOuter = halfPlane + borderWidth;
let borderColour = 0xffffff;

const planeGeometry = new THREE.PlaneGeometry(pSize, pSize);

// arrays for planes and grids
let planes = [];
let grids = [];
let borders = [];
let groups = [];

export function initGrid({ renderer, camera }) {
  pixelsPerWorldUnit = renderer.domElement.height / (camera.top - camera.bottom);
  rawSpacing = targetPixelSpacing / pixelsPerWorldUnit;
}

function createPlaneMaterial(color) {
  return new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: planeOpacity,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    depthWrite: false,
    blending: THREE.CustomBlending
  });
}

const xyMaterial = createPlaneMaterial(xyColour);
const zyMaterial = createPlaneMaterial(zyColour);
const xzMaterial = createPlaneMaterial(xzColour);
const abMaterial = createPlaneMaterial(abColour);
const cbMaterial = createPlaneMaterial(cbColour);
const acMaterial = createPlaneMaterial(acColour);

// stop orange and blue mixing
//acMaterial.blending = THREE.NormalBlending;


// // Utility to create a grid as BufferGeometry lines
// function createGridLines(size, divisions, color) {
//   const step = size / divisions;
//   const half = size / 2;
//   const vertices = [];

//   for (let i = 0; i <= divisions; i++) {
//     const k = -half + i * step;
//     // X lines (horizontal)
//     vertices.push(-half, k, 0, half, k, 0);
//     // Y lines (vertical)
//     vertices.push(k, -half, 0, k, half, 0);
//   }
//   // grid line material
//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
//   const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5});
//   return new THREE.LineSegments(gemeshChildrenometry, material);
// }

const gridMaterial = new THREE.ShaderMaterial({
  vertexShader: gridVertexShader,
  fragmentShader: gridFragmentShader,
  uniforms: {
    lineThickness: { value: 0.02 },
    u_color: { value: new THREE.Color(0x000000)},
    u_spacing: { value: 10.0 }, // number of lines per unit
     u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    //cameraPos: { value: new THREE.Vector3() }
    }
  ,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  blending: THREE.NormalBlending, // allows the grid to blend over the plane
});

function createCircleTexture(size = 64, color = 'white') {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Clear background transparent
  ctx.clearRect(0, 0, size, size);

  // Draw filled circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Create a texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter; // smoother scaling
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
}


// Use a ShaderMaterial to render the grid procedurally,
// Like professional CAD programs do for infinite grids.

function createGridLines(size, divisions) {
  const step = size / divisions;
  const half = size / 2;
  const vertices = [];

  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      const x = -half + i * step;
      const y = -half + j * step;
      vertices.push(x, y, 0); // all dots lie on z = 0
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const circleTexture = createCircleTexture(128, 'white');

  const material = new THREE.PointsMaterial({
    size: 1,
    // dot size stays constant in screen-space for orthographic CAD-style views
    sizeAttenuation: false,
    map: circleTexture,
    transparent: true,
    alphaTest: 0.5, // discard pixels with alpha < 0.5 for crisp edges
    opacity: 1,
    color: 0x000000,
  });

  return new THREE.Points(geometry, material);
}

// Create planes
const xyPlane = new THREE.Mesh(planeGeometry, xyMaterial);
const zyPlane = new THREE.Mesh(planeGeometry, zyMaterial);
const xzPlane = new THREE.Mesh(planeGeometry, xzMaterial);
const abPlane = new THREE.Mesh(planeGeometry, abMaterial);
const cbPlane = new THREE.Mesh(planeGeometry, cbMaterial);
const acPlane = new THREE.Mesh(planeGeometry, acMaterial);

// cube planes for raycasting
planes = [xyPlane, zyPlane, xzPlane, abPlane, cbPlane, acPlane];

// Set plane names
xyPlane.name = 'XY : YELLOW';
zyPlane.name = 'ZY : RED';
xzPlane.name = 'XZ : BLUE';
abPlane.name = 'AB : PINK';
cbPlane.name = 'CB : GREEN';
acPlane.name = 'AC : ORANGE';

// Create grids
// const xyGrid = createGridLines(pSize, griddivs);
// const zyGrid = createGridLines(pSize, griddivs);
// const xzGrid = createGridLines(pSize, griddivs);
// const abGrid = createGridLines(pSize, griddivs);
// const cbGrid = createGridLines(pSize, griddivs);
// const acGrid = createGridLines(pSize, griddivs);

function createGrid() {
  const grid = new THREE.Mesh(planeGeometry, gridMaterial);
  grid.position.z += 0.001; // tiny offset to avoid z-fighting
  grid.material.transparent = true;
  grid.material.depthWrite = false;
  grid.material.blending = THREE.NormalBlending;
  grid.renderOrder = 1; // draw after base plane

  return grid;
}

const xyGrid = createGrid();
const zyGrid = createGrid();
const xzGrid = createGrid();
const abGrid = createGrid();
const cbGrid = createGrid();
const acGrid = createGrid();

// Grids
grids = [xyGrid, zyGrid, xzGrid, abGrid, cbGrid, acGrid];

// Grid shaders
applyGridShaderToPlanes(grids);

function applyGridShaderToPlanes(grids) {
  for (const grid of grids) {
    grid.material = gridMaterial;
  }
}

export function updateGridUniforms() {
  const dist = app.camera.position.length(); // or more accurate plane distance
  // screen consistency, important for CAD
  const pixelDensity = app.renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(app.camera.fov / 2)) * dist);
  const rawSpacing = 20 / pixelDensity;

  const spacing = getRoundedSpacing(rawSpacing); // e.g. 0.1, 0.5, 1, 2, 5, 10...
  
  gridMaterial.uniforms.u_spacing.value = spacing;
  //gridMaterial.uniforms.cameraPos.value.copy(camera.position);
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

// Create plane and grid groups
const xyGroup = new THREE.Group();
const zyGroup = new THREE.Group();
const xzGroup = new THREE.Group();
const abGroup = new THREE.Group();
const cbGroup = new THREE.Group();
const acGroup = new THREE.Group();

// groups
groups = [xyGroup, zyGroup, xzGroup, abGroup, cbGroup, acGroup];

// Add planes to groups
xyGroup.add(xyPlane);
zyGroup.add(zyPlane);
xzGroup.add(xzPlane);
abGroup.add(abPlane);
cbGroup.add(cbPlane);
acGroup.add(acPlane);

// Check axis of planes
//const axis = new THREE.AxesHelper(300);
//acGroup.add(axis);

function createBorderStrip() {
  // Outer frame: covers full plane + border on all sides
  const outer = new THREE.Shape();
  outer.moveTo(-halfOuter, -halfOuter);
  outer.lineTo(halfOuter, -halfOuter);
  outer.lineTo(halfOuter, halfOuter);
  outer.lineTo(-halfOuter, halfOuter);
  outer.lineTo(-halfOuter, -halfOuter);

  // Inner hole: matches exact plane dimensions
  const inner = new THREE.Path();
  inner.moveTo(-halfPlane, -halfPlane);
  inner.lineTo(-halfPlane, halfPlane);
  inner.lineTo(halfPlane, halfPlane);
  inner.lineTo(halfPlane, -halfPlane);
  inner.lineTo(-halfPlane, -halfPlane);

  outer.holes.push(inner);

  const geometry = new THREE.ShapeGeometry(outer);
  const material = new THREE.MeshBasicMaterial({
    color: borderColour,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: planeOpacity
  });

  return new THREE.Mesh(geometry, material);
}

const xyBorder = createBorderStrip();
const zyBorder = createBorderStrip();
const xzBorder = createBorderStrip();
const abBorder = createBorderStrip();
const cbBorder = createBorderStrip();
const acBorder = createBorderStrip();

borders = [xyBorder, zyBorder, xzBorder, abBorder, cbBorder, acBorder];

// Add borders to groups
xyGroup.add(xyBorder);
zyGroup.add(zyBorder);
xzGroup.add(xzBorder);
abGroup.add(abBorder);
cbGroup.add(cbBorder);
acGroup.add(acBorder);

const outerPoints = [
  new THREE.Vector3(-halfOuter, -halfOuter, 0),
  new THREE.Vector3(halfOuter, -halfOuter, 0),
  new THREE.Vector3(halfOuter, halfOuter, 0),
  new THREE.Vector3(-halfOuter, halfOuter, 0),
  new THREE.Vector3(-halfOuter, -halfOuter, 0)
];

function createOutline() {
  const outlineGeometry = new THREE.BufferGeometry().setFromPoints(outerPoints);
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  
  return new THREE.LineLoop(outlineGeometry, outlineMaterial);
}

const xyOutline = createOutline();
const zyOutline = createOutline();
const xzOutline = createOutline();
const abOutline = createOutline();
const cbOutline = createOutline();
const acOutline = createOutline();

// Add borders to groups
xyGroup.add(xyOutline);
zyGroup.add(zyOutline);
xzGroup.add(xzOutline);
abGroup.add(abOutline);
cbGroup.add(cbOutline);
acGroup.add(acOutline);

groups = {xyGroup, zyGroup, xzGroup, abGroup, cbGroup, acGroup};

const groupSet = {
  xyGroup:    { pos: [halfPlane, halfPlane, -gap-borderWidth*1], rot: [0, Math.PI, 0] },
  zyGroup:    { pos: [-gap-borderWidth*1, halfPlane, halfPlane], rot: [0, -Math.PI/2, 0] },
  xzGroup:    { pos: [halfPlane, -gap-borderWidth*1, halfPlane], rot: [Math.PI/2, 0, 0] },
  abGroup:    { pos: [halfPlane, halfPlane ,pSize+gap+borderWidth*1], rot: [0, Math.PI, 0] },
  cbGroup:    { pos: [pSize+gap+borderWidth*1, halfPlane, halfPlane], rot: [0, Math.PI/2, 0] },
  acGroup:    { pos: [halfPlane, pSize+gap+borderWidth*1, halfPlane], rot: [-Math.PI/2, 0, 0] },
};

for (const key in groups) {
  const { pos, rot } = groupSet[key];
  const group = groups[key];
  group.position.set(...pos);
  group.rotation.set(...rot);
}

// Create Axis labels
function createAxisLabel(text, color, position) {
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
  sprite.scale.set(labelSize, labelSize, 1); // Adjust size as needed
  sprite.position.copy(position);
  return sprite;
}

// Add axis labels
const xLabel = createAxisLabel('X', 0x000000, new THREE.Vector3(halfPlane, -labelOffset, -labelOffset));
const yLabel = createAxisLabel('Y', 0x000000, new THREE.Vector3(-labelOffset, halfPlane, -labelOffset));
const zLabel = createAxisLabel('Z', 0x000000, new THREE.Vector3(-labelOffset, -labelOffset, halfPlane));
// Add labels for A, B, C planes
const aLabel = createAxisLabel('A', 0x000000, new THREE.Vector3(halfPlane, pSize+labelOffset, pSize+labelOffset));
const bLabel = createAxisLabel('B', 0x000000, new THREE.Vector3(pSize+labelOffset, halfPlane, pSize+labelOffset));
const cLabel = createAxisLabel('C', 0x000000, new THREE.Vector3(pSize+labelOffset, pSize+labelOffset, halfPlane));

// Inner box guide
const boxA = new THREE.BoxGeometry(pSize, pSize, pSize);
const edges = new THREE.EdgesGeometry(boxA); // extracts edges
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8 });
const boxFrame = new THREE.LineSegments(edges, lineMaterial);
boxFrame.position.set(halfPlane, halfPlane, halfPlane);

// Master group
const cube = new THREE.Group();
cube.add(xyGroup, xzGroup, zyGroup, abGroup, cbGroup, acGroup);
cube.add(xLabel, yLabel, zLabel, aLabel, bLabel, cLabel);
cube.add(boxFrame);

// Attach named exports to the default export
cube.pSize = pSize;
cube.gap = gap;
cube.halfPlane = halfPlane;
cube.boxFrame = boxFrame;
cube.xyGroup = xyGroup;
cube.xzGroup = xzGroup;
cube.zyGroup = zyGroup;
cube.abGroup = abGroup;
cube.cbGroup = cbGroup;
cube.acGroup = acGroup;
cube.xLabel = xLabel;
cube.yLabel = yLabel;
cube.zLabel = zLabel;
cube.aLabel = aLabel;
cube.bLabel = bLabel;
cube.cLabel = cLabel;
cube.planes = planes;

export {
  cube as default, pSize, gap, halfPlane, boxFrame, xyGroup, xzGroup, zyGroup, abGroup, cbGroup, acGroup,
  xLabel, yLabel, zLabel, aLabel, bLabel, cLabel
};

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

export function scaleGuides() {
  scaleLabels();
}

// Adaptive grid spacing (purely visual)
// Independent of zoom level, camera, or grid.
// All measurements, drawings, and constraints obey the same consistent unit system.
function scaleGrids() {
  // Define base point size and scale factor
  const baseSize = 1; // match original PointsMaterial size
  const pointSize = Math.min(baseSize * camera.zoom, baseSize);
  // Update each grid’s point size
  [
    xyGrid,
    zyGrid,
    xzGrid,
    abGrid,
    cbGrid,
    acGrid
  ].forEach(grid => {
    grid.material.size = pointSize;
    // needed if you're changing parameters that affect the shader (like size or color).
    grid.material.needsUpdate = true;
  });
}

// --- Axis label scaling (optional, for consistent size) ---
function scaleLabels() {
  const labelScale = labelSize / app.camera.zoom;
  cube.xLabel.scale.set(labelScale, labelScale, labelScale);
  cube.yLabel.scale.set(labelScale, labelScale, labelScale);
  cube.zLabel.scale.set(labelScale, labelScale, labelScale);
  cube.aLabel.scale.set(labelScale, labelScale, labelScale);
  cube.bLabel.scale.set(labelScale, labelScale, labelScale);
  cube.cLabel.scale.set(labelScale, labelScale, labelScale);
}
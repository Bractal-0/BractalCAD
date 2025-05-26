import * as THREE from 'three';

// Plane geometry
let pSize = 10;
let halfPlane = pSize/2;
let griddivs = 20;

const planeGeometry = new THREE.PlaneGeometry(pSize, pSize);

let gapScale = 0.7;
// cube gap
let gap = pSize * gapScale;

let labelScale = 0.4;
let labelSize = 10 * labelScale;

// min label = 

const xyColour = 0xFFFF00;  // Yellow
const zyColour = 0xFF0000;  // Red
const xzColour = 0x0000FF;  // Blue
const abColour = 0xFF5CFF;  // Pink
const cbColour = 0x008000;  // Green
const acColour = 0xFF7518;  // Orange

const planeOpacity = 0.6;

const xyMaterial = new THREE.MeshBasicMaterial({ color: xyColour, side: THREE.DoubleSide, transparent: true, opacity: planeOpacity,   polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1, depthWrite: true,
  blending: THREE.NoBlending });
const zyMaterial = new THREE.MeshBasicMaterial({ color: zyColour, side: THREE.DoubleSide, transparent: true, opacity: planeOpacity,   polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1, depthWrite: true,
  blending: THREE.NoBlending });
const xzMaterial = new THREE.MeshBasicMaterial({ color: xzColour, side: THREE.DoubleSide, transparent: true, opacity: planeOpacity,   polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1, depthWrite: true,
  blending: THREE.NoBlending});
const abMaterial = new THREE.MeshBasicMaterial({ color: abColour, side: THREE.DoubleSide, transparent: true, opacity: planeOpacity,   polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1, depthWrite: true,
  blending: THREE.NoBlending });
const cbMaterial = new THREE.MeshBasicMaterial({ color: cbColour, side: THREE.DoubleSide, transparent: true, opacity: planeOpacity,   polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1, depthWrite: true,
  blending: THREE.NoBlending });
const acMaterial = new THREE.MeshBasicMaterial({ color: acColour, side: THREE.DoubleSide, transparent: true, opacity: planeOpacity,   polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1, depthWrite: true,
  blending: THREE.NoBlending});

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
//   return new THREE.LineSegments(geometry, material);
// }

function createGridLines(size, divisions) {
  const step = size / divisions;
  const half = size / 2;
  const vertices = [];

  for (let i = 0; i <= divisions; i++) {
    for (let j = 0; j <= divisions; j++) {
      const x = -half + i * step;
      const y = -half + j * step;
      vertices.push(x, y, 0); // all dots lie on z = 0
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    color: 0x000000,
    size: 1, // adjust dot size here
    transparent: true,
    opacity: 0.4,
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

// Set plane names
xyPlane.name = 'XY Plane: YELLOW';
zyPlane.name = 'ZY Plane: RED';
xzPlane.name = 'XZ Plane: BLUE';
abPlane.name = 'AB Plane: PINK';
cbPlane.name = 'CB Plane: GREEN';
acPlane.name = 'AC Plane: ORANGE';

// Create grids
const xyGrid = createGridLines(pSize, griddivs);
const zyGrid = createGridLines(pSize, griddivs);
const xzGrid = createGridLines(pSize, griddivs);
const abGrid = createGridLines(pSize, griddivs);
const cbGrid = createGridLines(pSize, griddivs);
const acGrid = createGridLines(pSize, griddivs);

// Create plan and grid groups
const xyGroup = new THREE.Group();
const zyGroup = new THREE.Group();
const xzGroup = new THREE.Group();
const abGroup = new THREE.Group();
const cbGroup = new THREE.Group();
const acGroup = new THREE.Group();

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

// Set group rotation & positions
xyGroup.position.set(pSize/2, pSize/2, -gap+0);
xyGroup.rotation.y = Math.PI;

zyGroup.rotation.y = -Math.PI/2;
zyGroup.position.set(-gap+0, pSize/2, pSize/2);

// +x axis is aligned with world x.
xzGroup.rotation.x = Math.PI/2;
xzGroup.position.set(pSize/2, -gap+0, pSize/2);

abGroup.position.set(pSize/2,pSize/2,pSize+gap);

cbGroup.rotation.y = Math.PI/2;
cbGroup.position.set(pSize+gap, pSize/2, pSize/2);

// +x axis is aligned with world x.
acGroup.rotation.x = -Math.PI/2;
acGroup.position.set(pSize/2, pSize+gap, pSize/2);

// Master group
const cube = new THREE.Group();
cube.add(xyGroup, xzGroup, zyGroup, abGroup, cbGroup, acGroup);

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
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.4 });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(labelSize, labelSize, 1); // Adjust size as needed
  sprite.position.copy(position);
  return sprite;
}

// Add axis labels
const xLabel = createAxisLabel('X', 0x000000, new THREE.Vector3(halfPlane, -gap, -gap));
const yLabel = createAxisLabel('Y', 0x000000, new THREE.Vector3(-gap, halfPlane, -gap));
const zLabel = createAxisLabel('Z', 0x000000, new THREE.Vector3(-gap, -gap, halfPlane));
// Add labels for A, B, C planes
const aLabel = createAxisLabel('A', 0x000000, new THREE.Vector3(halfPlane, pSize+gap, pSize+gap));
const bLabel = createAxisLabel('B', 0x000000, new THREE.Vector3(pSize+gap, halfPlane, pSize+gap));
const cLabel = createAxisLabel('C', 0x000000, new THREE.Vector3(pSize+gap, pSize+gap, halfPlane));

cube.add(xLabel, yLabel, zLabel, aLabel, bLabel, cLabel);

// Set the labels to be in front of the planes
xLabel.renderOrder = 1;
yLabel.renderOrder = 1;
zLabel.renderOrder = 1;
aLabel.renderOrder = 1;
bLabel.renderOrder = 1;
cLabel.renderOrder = 1;

// Attach named exports to the default export
cube.pSize = pSize;
cube.gap = gap;
cube.halfPlane = halfPlane;
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

export {
  cube as default, pSize, gap, halfPlane, xyGroup, xzGroup, zyGroup, abGroup, cbGroup, acGroup,
  xLabel, yLabel, zLabel, aLabel, bLabel, cLabel
};

export function toggleGrids(scene) {

  if (xyGroup.children.length == 2) {
    xyGroup.remove(xyGrid);
    zyGroup.remove(zyGrid);
    xzGroup.remove(xzGrid);
    abGroup.remove(abGrid);
    cbGroup.remove(cbGrid);
    acGroup.remove(acGrid);
  } else {
    // Add cube to groups
    xyGroup.add(xyGrid);
    zyGroup.add(zyGrid);
    xzGroup.add(xzGrid);
    abGroup.add(abGrid);
    cbGroup.add(cbGrid);
    acGroup.add(acGrid);
  }
}

export function scaleGrids() {

}

    // --- Axis label scaling (optional, for consistent size) ---
export function scaleLabels(camera) {
  const labelScale = labelSize / camera.zoom;
  cube.xLabel.scale.set(labelScale, labelScale, labelScale);
  cube.yLabel.scale.set(labelScale, labelScale, labelScale);
  cube.zLabel.scale.set(labelScale, labelScale, labelScale);
  cube.aLabel.scale.set(labelScale, labelScale, labelScale);
  cube.bLabel.scale.set(labelScale, labelScale, labelScale);
  cube.cLabel.scale.set(labelScale, labelScale, labelScale);
}
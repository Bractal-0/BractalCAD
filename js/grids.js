import * as THREE from 'three';

// Plane geometry
const pSize = 100;
const griddivs = 10;

const planeGeometry = new THREE.PlaneGeometry(pSize, pSize);

const xyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
const zyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
const xzMaterial = new THREE.MeshBasicMaterial({ color: 0x8a8a8a, side: THREE.DoubleSide, transparent: true, opacity: 0.8});

// Utility to create a grid as BufferGeometry lines
function createGridLines(size, divisions, color) {
  const step = size / divisions;
  const half = size / 2;
  const vertices = [];

  for (let i = 0; i <= divisions; i++) {
    const k = -half + i * step;
    // X lines (horizontal)
    vertices.push(-half, k, 0, half, k, 0);
    // Y lines (vertical)
    vertices.push(k, -half, 0, k, half, 0);
  }
  // grid line material
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.LineBasicMaterial({ color, opacity: 0.3 });
  return new THREE.LineSegments(geometry, material);
}

// XY
const xyPlane = new THREE.Mesh(planeGeometry, xyMaterial);
xyPlane.position.set(pSize/2, pSize/2, 0);
xyPlane.rotation.x = Math.PI;

const xyGrid = createGridLines(pSize, griddivs, 0x00ff00);
xyGrid.position.set(pSize/2, pSize/2, 0);
xyGrid.rotation.x = Math.PI;

// Combine XY plane and grid
const xyGroup = new THREE.Group();
xyGroup.add(xyPlane, xyGrid);

// ZY
const zyPlane = new THREE.Mesh(planeGeometry, zyMaterial);
zyPlane.position.set(0, pSize/2, pSize/2);
zyPlane.rotation.y = Math.PI / 2;

const zyGrid = createGridLines(pSize, griddivs, 0xff0000);
zyGrid.position.set(0, pSize/2, pSize/2);
zyGrid.rotation.y = Math.PI / 2;

// Combine YZ plane and grid
const zyGroup = new THREE.Group();
zyGroup.add(zyPlane, zyGrid);

// XZ
const xzPlane = new THREE.Mesh(planeGeometry, xzMaterial);
xzPlane.position.set(pSize/2, 0, pSize/2);
xzPlane.rotation.x = Math.PI / 2;

const xzGrid = createGridLines(pSize, griddivs, 0x0000ff);
xzGrid.position.set(pSize/2, 0, pSize/2);
xzGrid.rotation.x = Math.PI/2;

// Combine XZ plane and grid
const xzGroup = new THREE.Group();
xzGroup.add(xzPlane, xzGrid);

// Master group
const gridsGroup = new THREE.Group();
gridsGroup.add(xyGroup, xzGroup, zyGroup);

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
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(6, 6, 1); // Adjust size as needed
  sprite.position.copy(position);
  return sprite;
}

// Add axis labels
const offset = pSize + 10;
const xLabel = createAxisLabel('X', '#f00', new THREE.Vector3(offset, 0, 0));
const yLabel = createAxisLabel('Y', '#0f0', new THREE.Vector3(0, offset, 0));
const zLabel = createAxisLabel('Z', '#00f', new THREE.Vector3(0, 0, offset));

gridsGroup.add(xLabel, yLabel, zLabel);

export {
  gridsGroup as default, pSize, xyGroup, xzGroup, zyGroup,
  xLabel, yLabel, zLabel};
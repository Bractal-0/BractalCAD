import * as THREE from 'three';

// Plane geometry
const pSize = 80;
const planeGeometry = new THREE.PlaneGeometry(pSize, pSize);

// Grid size and divisions
const gridSize = pSize;
const gridDivisions = 10;

// XY
const xyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
const xyPlane = new THREE.Mesh(planeGeometry, xyMaterial);
xyPlane.position.set(pSize/2, pSize/2, 0);
const xyGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x00ff00, 0x00ff00);
xyGrid.rotation.x = Math.PI / 2;
xyGrid.position.set(pSize/2, pSize/2, 0);
const xyGroup = new THREE.Group();
xyGroup.add(xyPlane, xyGrid);

// XZ
const xzMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
const xzPlane = new THREE.Mesh(planeGeometry, xzMaterial);
xzPlane.rotation.x = -Math.PI / 2;
xzPlane.position.set(pSize/2, 0, pSize/2);
const xzGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x0000ff, 0x0000ff);
xzGrid.position.set(pSize/2, 0, pSize/2);
const xzGroup = new THREE.Group();
xzGroup.add(xzPlane, xzGrid);

// YZ
const yzMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
const yzPlane = new THREE.Mesh(planeGeometry, yzMaterial);
yzPlane.rotation.y = -Math.PI / 2;
yzPlane.position.set(0, pSize/2, pSize/2);
const yzGrid = new THREE.GridHelper(gridSize, gridDivisions, 0xff0000, 0xff0000);
yzGrid.rotation.z = Math.PI / 2;
yzGrid.position.set(0, pSize/2, pSize/2);
const yzGroup = new THREE.Group();
yzGroup.add(yzPlane, yzGrid);

// Master group
const gridsGroup = new THREE.Group();
gridsGroup.add(xyGroup, xzGroup, yzGroup);

function createAxisLabel(text, color, position) {
  const canvas = document.createElement('canvas');
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
  sprite.scale.set(8, 8, 1); // Adjust size as needed
  sprite.position.copy(position);
  return sprite;
}

// Add axis labels
const offset = pSize + 6;
const xLabel = createAxisLabel('X', '#f00', new THREE.Vector3(offset, 0, 0));
const yLabel = createAxisLabel('Y', '#0f0', new THREE.Vector3(0, offset, 0));
const zLabel = createAxisLabel('Z', '#00f', new THREE.Vector3(0, 0, offset));

gridsGroup.add(xLabel, yLabel, zLabel);

export { gridsGroup as default, xyGroup, xzGroup, yzGroup };
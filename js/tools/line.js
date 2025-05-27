import * as THREE from 'three';

const lineStroke = new THREE.LineBasicMaterial({
  color: 0x000000, // Default line color
  linewidth: 2, // Default line width
  transparent: true,
  opacity: 1,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
  blending: THREE.NoBlending
});

export default lineStroke;
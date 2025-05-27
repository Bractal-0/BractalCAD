import * as THREE from 'three';

const sketch = new THREE.Group();

sketch.name = 'Sketch';



export function addToSketch(object) {
  
  // Add the object to sketch
  sketch.add(object);
  
}
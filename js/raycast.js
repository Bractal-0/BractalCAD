import * as THREE from 'three';
import ray from './ray.js';
import { app } from './app.js';

// 2D screen point
const pointer = new THREE.Vector2();

// Keep all state inside raycast.
let raycast = {
  point: null,
  object: null
};

let intersection;

// Convert world point to local point
let localPoint;

function onPointerMove(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('pointermove', onPointerMove, false);

export function castRay() {
  // find intersections
  ray.setFromCamera(pointer, app.camera);
  // all scene children, recursive = false
  const intersects = ray.intersectObjects(app.scene.children, true);
  //console.log('Pointer:', pointer);
  if (intersects.length > 0) {
    //console.log('Intersections found:', intersects);
    intersection = intersects[0];
    raycast.object = intersection.object;
    raycast.point = intersection.point;
    //console.log("raycast x: " + raycast.point.z);
  } else {
    raycast.point = null;
    raycast.object = null;
  }
}

// Checks if front of plane. Might use.
function frontOfPlane(object) {
  // Dot product between face normal and ray direction
  // If < 0 → hit the front side
  if (intersection !== null) {
    const front = intersection.face.normal.clone().applyMatrix3(
      new THREE.Matrix3().getNormalMatrix(object.matrixWorld)
    ).normalize();

    const dot = front.dot(ray.ray.direction);

    if (dot < 0) {
      // Ray hit the front face
      //console.log('Front hit:', object.name);
      // console.log(planeHit);
      return object;
    } else {
      // Ray hit the back face
      //console.log('Back hit:', object.name);
      return null;
    }
  } else {
    console.log("intersection: " + intersection.object)
  }
}

export default raycast;
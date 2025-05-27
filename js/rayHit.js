import * as THREE from 'three';
import ray from './ray.js';
import camera from './camera.js';
import cube from './cube.js';

// 2D screen point
const pointer = new THREE.Vector2();

let hit, planeHit;

// 3D point when hit
let point;

let intersection, object;

// Convert world point to local point
let localPoint


function onPointerMove(e) {
  pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener('pointermove', onPointerMove, false);

export function hitObject() {
  // find intersections
  ray.setFromCamera(pointer, camera);
  const intersects = ray.intersectObjects(cube.planes, false);
  //console.log('Pointer:', pointer);
  if (intersects.length > 0) {
    hit = true;
    //console.log('Intersections found:', intersects.length);

    intersection = intersects[0];
    object = intersection.object;

    //console.log(intersection.point);
    //console.log(object);

    point = intersection.point;
    // Convert world point to local point
    localPoint = object.worldToLocal(point.clone());
    console.log('Local point:', localPoint);

  } else {
    hit = false;
  }
}

export function frontOfPlane() {
  // Dot product between face normal and ray direction
  // If < 0 → hit the front side
  const front = intersection.face.normal.clone().applyMatrix3(
    new THREE.Matrix3().getNormalMatrix(hitObject.matrixWorld)
  ).normalize();

  const dot = front.dot(ray.ray.direction);

  if (dot < 0) {
    // Ray hit the front face
    //console.log('Front hit:', hitObject.name);
    // console.log(planeHit);
    return object;
  } else {
    // Ray hit the back face
    //console.log('Back hit:', hitObject.name);
    // console.log(planeHit);
    return null;
  }
}

ray.hit = hit;

export {pointer, hit, point};
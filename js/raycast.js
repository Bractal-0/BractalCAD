import * as THREE from 'three';
import scene from './scene.js';
import ray from './ray.js';
import camera from './camera.js';
import cube from './cube.js';
import objects from './sceneLogic.js';

// 2D screen point
const pointer = new THREE.Vector2();

// Keep all state inside raycast.
let raycast = {
  hit: false,
  point: null,
  localPoint: null,
  object: null,
  plane: null,
  lastPlane: null,
  samePlane: false
};

let intersection;

// Convert world point to local point
let localPoint;

function onPointerMove(e) {
  pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener('pointermove', onPointerMove, false);

export function castRay() {
  // find intersections
  ray.setFromCamera(pointer, camera);
  // all scene children, recursive = true
  const intersects = ray.intersectObjects(objects, true);
  //console.log('Pointer:', pointer);
  if (intersects.length > 0) {
    raycast.hit = true;
    //console.log('Intersections found:', intersects);

    intersection = intersects[0];
    raycast.object = intersection.object;
    raycast.point = intersection.point;

    //console.log("raycast x: " + raycast.point.z);

    isPlane();

    // if (plane) {
    //   console.log(plane.name);
    // }
    //console.log(hit);
    //console.log(point);
    //console.log('Local point:', localPoint);

  } else {
    raycast.hit = false;
    raycast.point = null;
    raycast.object = null;
    raycast.plane = null;
    raycast.lastPlane = null;
    raycast.samePlane = false;
  }
}

function isPlane() {
  // Checks if plane geometry
  if (raycast.object.geometry instanceof THREE.PlaneGeometry) {
    raycast.plane = raycast.object;
    // Convert world point to local point
    raycast.localPoint = raycast.plane.worldToLocal(raycast.point.clone());
  }
}

// Needs to be called on click
export function isSamePlane(plane) {
  if (raycast.lastPlane === raycast.plane) {
    raycast.samePlane = true;
    return true;
  } else {
    raycast.samePlane = false;
    return false;
  }
}

// Returns true if hit object is a plane 
function whichPlane(object) {
  for (let i = 0; i < cube.planes.length; i++) {
    if (object === cube.planes[i]) {
      //console.log("IT'S A PLANE");
      raycast.plane = object;
      updateActivePlane(raycast.plane);
    } else {
    }
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
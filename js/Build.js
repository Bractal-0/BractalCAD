import * as THREE from 'three';

import { app } from './app.js';

export class Build extends THREE.Group {
  constructor(planes, planeSize) {
    super();
    // planes from cube
    this.planes = planes;
    // Size of the build box for projecting the 3D objects
    this.size = planeSize;

    this.buildBox = null;

    this.sketches = {};
    this.objects = {};
    this.projections = {};

    this.init();
  }

  init() {
    // Inner box guide
    const boxA = new THREE.BoxGeometry(this.size, this.size, this.size);
    const edges = new THREE.EdgesGeometry(boxA); // extracts edges
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
    this.buildBox = new THREE.LineSegments(edges, lineMaterial);
    this.buildBox.position.set(this.size/2, this.size/2, this.size/2);
    this.buildBox.renderOrder = 1;
    this.buildBox.name = "build-box";
    this.add(this.buildBox);

    // Need to store each connected lines as a sketch
    // Need the plane of each sketch
    // Project them to 3D
    // Store 3D objects in array.
    // Maintain order for undo/redo history

    // sketch object storing the plane the line array is on, uuid, and array of line objects

    this.sketches = {
      lines: [],

      addSketch: (sketch, plane) => {
        plane.add(sketch);
        this.sketches.lines.push({ sketch, plane });
        // To access the sketch objects
        // const lineId = line.uuid;
        // console.log(this.lines.length);
        // printing last line objects plane
        // console.log(this.lines[this.lines.length-1].plane);

        // project sketch to 3D and add to scene
        //this.objects.extrude(sketch);
      },

      clearSketch() {
        this.lines.forEach(({ sketch, plane }) => {
          plane.remove(sketch);
          sketch.geometry.dispose();
          sketch.material.dispose();
        });
        this.lines = [];
      }
    };

    this.objects = {
      // Objects should be childs of the build box
      list: [],

      extrude(sketch) {

        const start = new THREE.Vector3(
          sketch[0],
          sketch[1],
          sketch[2]
        );

        const lastIndex = sketch.length - 3;

        const end = new THREE.Vector3(
          sketch[lastIndex],
          sketch[lastIndex + 1],
          sketch[lastIndex + 2]
        );

        // Extrude direction (e.g. along Y-axis)
        const extrudeDir = new THREE.Vector3(0, 0, 1).normalize();
        const distance = 2;

        const geometry = new THREE.BufferGeometry();

        // Compute extruded points
        //const startExtruded = start.clone().add(extrudeDir.clone().multiplyScalar(distance));
        //const endExtruded = end.clone().add(extrudeDir.clone().multiplyScalar(distance));


        //geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        //geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: 0x000000, opacity: 1});

        // the 3D object
        const mesh = new THREE.Mesh(geometry, material);

        // Add new object to objects array
        this.list.push(mesh);

        app.scene.add(mesh);
      }

    };

    // Tie sketches together and project to all planes.
    this.projections = {
      mirrors: [],

      // Need to map of each plane
      // check which plane the sketch is
      // and project to the rest.
      updatePlanes() {
        for (const sketch of this.sketches) {
          
        }
      }
    }
  }
}

export default Build;
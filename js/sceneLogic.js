import cube from './cube.js';

const objects = [];

for (let mesh of cube.planes) {
  objects.push(mesh);
  //console.log(mesh.name);
}

export default objects;
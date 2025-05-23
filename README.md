Project aim:

This project aims to be a working prototype of an idea I had for a Computer-Aided Design technique using the simple aspects of 2D design and orthographic projection as an integral part of the 3D design process.

Bractal's CAD involves using hollow 3D cubes where each face acts as a 2D plane for designing an object or part contained within. The user draws their design on the given plane as orthographic projections in side/front/bottom view, for the respective plane. Then where the drawings on each plane intersect inside the cube is where the object is created using boolean operations. Then the objects are rendered in another window to avoid a messy design process.

A single master cube, represented as three planes XY, ZY & XZ, and the object(s) inside can be just one part that can be grouped together to make a larger object; And like with the layers of photo editing software, these cubes can overlap each other to create intricate designs that each retain the 2D design details like measurements and drawing annotations.

Even professional designs, from floor plans of buildings, to small detailed parts are often made using orthographic projection. However, when we move to 3D design, a lot of that detail from measurements and drawing annotations are lost, or heavily obfuscated.

When we have an idea for a design, the first thing we do is try to draw it. Usually as an orthographic projection showing the side and front views.

Bractal's CAD seeks to retain the intuitive 2D aspects of design by making them an integral part of the 3D design process.

Short-term Project Goals:

  - Line tool (mapping 2D input to local plane)
  - tool modifier (add | cut)
  - Boolean operation (intersect to define the 3D object)
  - Import/Export as STL
  - Square tool
  - circle tool

Advanced features:

  - Layering / grouping
  - Boolean operations (difference, join, split)
  - Dashed lines for hidden detail
  - Mirror tool
  - Repeat pattern tool
  - Extrude tool
  - Import STL
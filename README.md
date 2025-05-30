Bractal's CAD aims to solely use orthographic projection to simplify the 3D design process.

This project intends to be a working prototype of an idea I had for a Computer-Aided Design technique to design 3D objects solely through 2D design and orthographic projection.

A single master cube, represented as six planes, where each face acts as a 2D plane for designing an object or part contained within. The user draws their design on the given plane as orthographic projections in side/front/top or bottom view, for the respective plane. Where the drawings on each plane intersect inside the cube, is where the object is created - or the objects could instead be rendered in another window altogether.

The object(s) inside, can be grouped to make a larger object, like with layers of photo editing software, these layers can overlap each other to create intricate designs that each retain the 2D design details like measurements and drawing annotations, a driving feature of the technique.

When we have an idea for a design, the first thing we do is try to draw it. Usually using orthographic projection with the side and front views. Everything, from technical drawings, blueprints, floor plans of buildings, to small detailed parts use orthographic projection. However, when we move to 3D design, a lot of that detail from measurements and drawing annotations is lost, or must be chased down again with a digital tape measure.

A particular target for the scope of this project will be to simplify rapid prototyping for 3D printing.

Short-term Project Goals:

  - Line tool (mapping 2D input to local plane) [DONE]
  - Rectangle tool [DONE]
  - Move tool
  - Boolean operation (intersect to define the 3D object)
  - measurements, take size inputs when drawing.
  - tool modifier (add | cut)
  - Import/Export as STL
  - circle tool
    - -/+ segments from triangle to full circle.

Advanced features:

  - Layering / grouping
  - Boolean operations (difference, join, split)
  - Dashed lines for hidden detail
  - Mirror tool
  - Repeat pattern tool
  - Extrude tool
  - Import STL
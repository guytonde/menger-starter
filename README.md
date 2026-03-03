Tanuj Tekkale (tt27868), Akshay Gaitonde (ag84839)

__Design Decisions__
- Cube mesh generation is flat-shaded with per-face normals, but vertices are shared between the two triangles on each face.
- Camera initialization is `eye=(0,0,-6)`, `target=(0,0,0)`, `up=(0,1,0)`.
- Mouse-drag rotation is applied on mouse-move events while dragging, rather than being stepped explicitly in the render loop once per frame.
- Number keys `1` through `4` regenerate and display Menger sponge levels 1 through 4.
- Sponge geometry is regenerated on level changes and uploaded to GPU buffers.
- Ground plane rendering uses separate mesh buffers and a separate shader program with checkerboard shading.

__Extra Credit (Projected Shadow)__
- Projected shadow of the Menger sponge onto the floor plane.
- Press `H` to toggle the projected floor shadow on/off.

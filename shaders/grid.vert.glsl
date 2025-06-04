// GLSL code
// GLSL code needs to be passed as raw strings to ShaderMaterial.
// JavaScript can’t natively import .glsl files,
// so we use a plugin like vite-plugin-string to
// treat them as plain text.
// Imported as strings via vite-plugin-string

uniform int u_plane; // 0: XZ, 1: XY, 2: YZ
varying vec2 vGridCoord;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    if (u_plane == 0) {
        vGridCoord = worldPos.xz; // XZ plane (top/bottom)
    } else if (u_plane == 1) {
        vGridCoord = worldPos.xy; // XY plane (front/back)
    } else if (u_plane == 2) {
        vGridCoord = worldPos.yz; // YZ plane (side views)
    }

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}

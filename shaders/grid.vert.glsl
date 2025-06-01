// GLSL code
// GLSL code needs to be passed as raw strings to ShaderMaterial.
// JavaScript can’t natively import .glsl files,
// so we use a plugin like vite-plugin-string to
// treat them as plain text.
// Imported as strings via vite-plugin-string

// Pass through vertex shader
precision mediump float;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

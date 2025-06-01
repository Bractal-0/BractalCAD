precision mediump float;

uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float u_spacing;
uniform float lineThickness;

varying vec2 vUv;

void main() {
    float gridX = abs(fract(vUv.x * u_spacing - 0.5) - 0.5);
    float gridY = abs(fract(vUv.y * u_spacing - 0.5) - 0.5);

    float line = min(gridX, gridY);

    // lineThickness = fraction of a UV unit (e.g. 0.01)
    float alpha = 1.0 - smoothstep(0.0, lineThickness, line);

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(u_color, alpha);
}

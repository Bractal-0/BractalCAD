precision mediump float;

uniform vec3 u_color;
uniform float u_spacing;
uniform float opacity;

uniform float u_viewportHeight;       // canvas pixel height
uniform float u_cameraHeight;         // camera frustum height in world units (no zoom)
uniform float u_zoom;                 // camera zoom factor
uniform float u_lineThicknessPixels; // desired thickness in pixels for minor lines
uniform float u_majorLineThicknessPixels; // desired thickness in pixels for major lines


varying vec2 vGridCoord;

float pixelThicknessToWorld(float pixelThickness) {
    // world units per pixel at zoom 1, adjusted by zoom
    return (u_cameraHeight / u_viewportHeight) * pixelThickness / u_zoom;
}

float gridLine(float coord, float spacing, float thickness) {
    float line = abs(mod(coord + 0.5 * spacing, spacing) - 0.5 * spacing);
    float aa = fwidth(coord);
    return 1.0 - smoothstep(thickness - aa, thickness + aa, line);
}

void main() {
    float minorThickness = pixelThicknessToWorld(u_lineThicknessPixels);
    float majorThickness = pixelThicknessToWorld(u_majorLineThicknessPixels);

    float majorSpacing = u_spacing * 5.0;

    float minorX = gridLine(vGridCoord.x, u_spacing, minorThickness);
    float minorY = gridLine(vGridCoord.y, u_spacing, minorThickness);
 
    float majorX = gridLine(vGridCoord.x, majorSpacing, majorThickness);
    float majorY = gridLine(vGridCoord.y, majorSpacing, majorThickness);

    float major = max(majorX, majorY);
    float minor = max(minorX, minorY);

    float gridAlpha = max(major, minor) * opacity;

    if (gridAlpha < 0.01) discard;

    gl_FragColor = vec4(u_color, gridAlpha);
}

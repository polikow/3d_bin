varying vec3  worldPosition;

uniform float u_size;   // размер клетки
uniform float u_width;  // ширина сетки
uniform float u_height; // высота сетки
uniform vec3  u_color;  // цвет сетки

// Возвращает альфу фрагмента для клетки размера size.
float getGrid(float size) {
    float draw_width_lines  = (u_width  <= 1.0) ? 0.0 : 1.0;
    float draw_height_lines = (u_height <= 1.0) ? 0.0 : 1.0;
    vec2  draw = vec2(draw_width_lines, draw_height_lines);

    vec2  r    = worldPosition.xy / size / draw;

    vec2  grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
    float line = min(grid.x, grid.y);

    return 1.0 - min(line, 1.0);
}

void main() {
    float g1 = getGrid(u_size);
    float g2 = 0.0;

    gl_FragColor   = vec4(u_color.rgb, mix(g2, g1, g1));
    gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);

    if (gl_FragColor.a <= 0.0) discard;
}
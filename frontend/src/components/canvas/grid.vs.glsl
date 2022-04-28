varying vec3  worldPosition; // положение фрагментарного шейдера

uniform float u_size;   // размер клетки
uniform float u_width;  // ширина сетки
uniform float u_height; // высота сетки

void main() {
    vec3 pos = position.xyz;
    float s  = u_size * 2.0;

    pos.x *= u_width;
    pos.y *= u_height;

    pos.x += mod(u_width , s) / 2.0;
    pos.y += mod(u_height, s) / 2.0;

    worldPosition = pos;

    pos.x -= mod(u_width , s) / 2.0;
    pos.y -= mod(u_height, s) / 2.0;

    gl_Position   = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
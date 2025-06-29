#version 300 es

precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform float u_time;

void main() {
    float r = sin(u_time) * 0.5 + 0.5;
    float g = cos(u_time) * 0.5 + 0.5;
    float b = sin(u_time * 0.5) * 0.5 + 0.5;
    outColor = vec4(r, g, b, 1.0);
}
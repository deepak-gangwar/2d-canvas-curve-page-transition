precision highp float;

uniform float uProgress;  // Progress of animation
uniform float uPower;     // Amplitude
uniform bool uOut;        // For closing animation

vec4 transparent = vec4(0., 0., 0., 0.);
// vec4 black = vec4(0., 0., 0., 1.);
vec4 black = vec4(0.0706, 0.2353, 0.1922, 1.0);

#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    //--------------FOR DOING IT VERTICALLY----------------

    // this has to come from uniforms
    // - makes concave upwards
    // + makes in concave downwards
    // 0 means bend is straight, flat
    // 1 means close to sine curve
    // so it goes from 0 to 1 to 0
    // float uPower = 1.0; //amplitude
    uv.y -= ((sin(uv.x * M_PI) * uPower) * .2);

    // This line reverses the colors
    if (!uOut) uv.y = 1. - uv.y;

    // float t = smoothstep(uv.y - fwidth(uv.y), uv.y, uProgress);
    // fwidth gives the blur or sharp edge, larger value, more blurred edge
    float t = smoothstep(uv.y - .001, uv.y, uProgress);


    // -------------FOR DOING IT HORIZONTALLY----------------
    // uv.x -= ((sin(uv.y * M_PI) * uPower) * .25);
    // if (!uOut) uv.x = 1. - uv.x;
    // float t = smoothstep(uv.x - .001, uv.x, uProgress);
    
    vec4 color = mix(transparent, black, t);

    gl_FragColor = color;
}
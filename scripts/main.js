// TODO: load a texture on the canvas


// retrieving canvas, setting context.
const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");

if (!gl) {
    console.log("Failed loading webGL 2 rendering context :(");
}


async function main() {

    // load, compile and link the program
    const vSource = await loadShaderSource('shaders/vertex.glsl');
    const fSource =  await loadShaderSource('shaders/fragment.glsl');
    const vShader = await compiledShader(gl, gl.VERTEX_SHADER, vSource);
    const fShader = await compiledShader(gl, gl.FRAGMENT_SHADER, fSource);
    const program = await createProgram(gl, vShader, fShader);

    // creating and binding position buffer. Locating attribute a_position.
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // base for vertex array to draw triangle
    const positions = [
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0,
        1.0, -1.0
    ]

    // raw data loaded in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayObject);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clear
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw
    gl.useProgram(program);
    gl.bindVertexArray(vertexArrayObject);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}


main();
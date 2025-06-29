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
    ];


    // raw data loaded in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);


    // parse buffer data
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // * SET VIEWPORT
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


    let startTime = performance.now();

    const render = time => {
        const elapsed = (time - startTime) / 1000 // convert to seconds

        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


}


main();
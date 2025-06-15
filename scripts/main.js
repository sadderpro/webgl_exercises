


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


    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // base for vertex array
    const positions = [
        0,0,
        0, 0.5,
        0.7, 0
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vertexArrayObject = gl.createVertexArray();

    gl.bindVertexArray(vertexArrayObject);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // ** data for vertex array pointer
    // ** will likely go unchanged for this example, thus the const declaration for primitives
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    // creating the vertex array pointer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // convert clip size values to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // set whole canvas to black
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // now we'll actually use our program
    gl.useProgram(program);
    gl.bindVertexArray(vertexArrayObject);

    const primitiveType = gl.TRIANGLES;
    const count = 3;

    gl.drawArrays(primitiveType, offset, count);

}


main();
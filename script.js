

/* --------------------- HELPER METHODS --------------------- */



// loads shader source from a file and returns it as a string
async function loadShaderSource(url) {

    const response = await fetch(url);
    if (!response.ok) {
        console.log(`Error loading shader at ${url}`);
        return;
    }
    return await response.text();
}



// returns a compiled shader to attach to a program
async function compiledShader(context, type, source) {

    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);

    const success = context.getShaderParameter(shader, context.COMPILE_STATUS);
    // TODO: Add info log to error message... Later.
    if (!success) {
        const info = gl.getShaderInfoLog(shader);
        console.log(`Failed compiling shader: ${info}`);
        return;
    }

    return await shader;
}


// uses compiled vertex and fragment shaders and attaches them to a program
async function createProgram(context, vShader, fShader) {
    
    const program = context.createProgram();
    context.attachShader(program, vShader);
    context.attachShader(program, fShader);
    context.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        
        console.log("Unable to link program.");
        return;
    }

    return await program;
}







/* --------------------- MAIN FUNCTION --------------------- */



// retrieving canvas, setting context.
const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");

if (!gl) {
    console.log("Failed loading webGL 2 rendering context :(");
}


async function main() {

    // load shaders
    const vSource = await loadShaderSource('shaders/vertex.glsl');
    const fSource =  await loadShaderSource('shaders/fragment.glsl');

    // compile shaders
    const vShader = await compiledShader(gl, gl.VERTEX_SHADER, vSource);
    const fShader = await compiledShader(gl, gl.FRAGMENT_SHADER, fSource);

    // link shaders to a new program
    const program = await createProgram(gl, vShader, fShader);

    // retrieve attribute a_position from vertex shader
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    
    // creating and binding buffer
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
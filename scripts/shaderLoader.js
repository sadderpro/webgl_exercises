/*

* this script is designed to load, compile and link the shaders
* in a single, static pipeline. Created for legibility and
* simplification. 

*/


async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.log(`Error loading shader at ${url}`)
        return;
    }
    return await response.text();
}

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

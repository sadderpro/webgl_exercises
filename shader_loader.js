// load shader source
async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.log(`Error loading shader at ${url}`)
        return;
    }
    return await response.text();
}
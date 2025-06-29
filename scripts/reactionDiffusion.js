/* 

    TODO: 

    1. Modify all functions to operate on two separate grid objects A and B.
    2. Implement all functions as arrow functions.

*/

// constants for gray-scott model
const diffusionRateA = 1.0;
const diffusionRateB = 0.5;

const feedRate = 0.0545;
const killRate = 0.062;

const gridSize = 300;

let dt = 1;

const clamp = (value, min, max) => {
    return Math.max(Math.min(value, max), min);
}

// better method to create a grid
const createGrid = (size, initialValue=0.0) => {
    return Array.from({length: size}, () =>
        new Array(size).fill(initialValue)
    );
}

let gridA = createGrid(gridSize, 1.0);
let gridB = createGrid(gridSize);

let newGridA = createGrid(gridSize);
let newGridB = createGrid(gridSize);


// seed gridB with random spots
for (let y=0; y < gridSize; y++) {
    for (let x=0; x < gridSize; x++) {
        if (Math.random() < 0.005) {
            gridB[y][x] = 1.0;
        }
    }
}

// this function will be called for each cell in the grid
const laplacian = (arr, x, y) => {

    const kernel = [
        [0.05, 0.2, 0.05],
        [ 0.2,  -1,  0.2],
        [0.05, 0.2, 0.05]
    ];

    let sum = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <=1; dx++) {
            ny = clamp(y+dy, 0, gridSize-1);
            nx = clamp(x+dx, 0, gridSize-1);
            sum += arr[ny][nx] * kernel[dy+1][dx+1]
        }
    }

    return sum;
    
}

// returns a new grid
const updateGrid = () => {
    // Initialize grid that will contain A' and B' values
    

    // traverse grid to get A and B for each grid cell
    for (let y=0; y < gridSize; y++){
        for (let x=0; x < gridSize; x++){

            // calculating laplacians
            let lapA = laplacian(gridA, x, y);
            let lapB = laplacian(gridB, x, y);

            let A = gridA[y][x];
            let B = gridB[y][x];
            

            // finally, we apply the equations for Gray-Scott model
            newGridA[y][x] = A + (diffusionRateA * lapA - A*B*B + feedRate * (1-A))*dt;
            newGridB[y][x] = B + (diffusionRateB * lapB + A*B*B - (killRate + feedRate)*B)*dt;

            // aaand clamp the values if needed
            newGridA[y][x] = clamp(newGridA[y][x], 0.0, 1.0);
            newGridB[y][x] = clamp(newgGridB[y][x], 0.0, 1.0);
        }
    }
}

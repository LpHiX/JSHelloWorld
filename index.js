const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var N = 200
let secondsPassed = 1;
let oldTimeStamp = 1;
let currentfps;
let fpsShift = N;

ctx.fillStyle = 'lightgreen';
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

// Initialization

var densities = new Array(N+2);
for (var i = 0; i < densities.length; i++){
    densities[i] = new Array(N+2);
}

for(var x = 0; x < N+2; x++){
    for(var y = 0; y < N+2; y++){
       densities[x][y] = 0;
    }
}

let rect = canvas.getBoundingClientRect();
function getMousePosition(event){
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    for( let i = -5; i <= 5; i++){
        for (let j = -5; j <= 5; j++){
            densities[y + i][x + j] = 1;
        }
    }
}
canvas.addEventListener("mousedown", function(e){
    getMousePosition(e);
})

// Start first frame

var fps, fpsInterval, startTime, now, then, elapsed;
fps = 100
fpsInterval = 1000 / fps;
then = Date.now();
startTime = then;

window.requestAnimationFrame(simulationLoop);

function simulationLoop(timeStamp){
    window.requestAnimationFrame(simulationLoop);
    
        // Printing
        var id = ctx.createImageData(N+2,N+2);
        var d = id.data;
        for(var i = 0; i < densities.length; i++){
            for(var j = 0; j < densities[i].length; j++){
                d[(i*(N+2) + j) * 4] = 0;
                d[(i*(N+2) + j) * 4 + 1] = densities[i][j] *255;
                d[(i*(N+2) + j) * 4 + 2] = 0;
                d[(i*(N+2) + j) * 4 + 3] = 255;
            }
        }
        ctx.putImageData(id, 0, 0);
    
    now = Date.now();
    elapsed = now - then;
    if( elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);

        simulationStep(timeStamp);
    }

}

function simulationStep(timeStamp){
    // Diffusion
    let diff_step = 0.01;
    for( var k = 0; k < 20; k++){
        for(var x = 1; x <= N; x++){
            for(var y = 1; y <= N; y++){
                let a = ((densities[x][y]) + diff_step * ((
                    densities[x+1][y]+densities[x-1][y]+densities[x][y+1]+densities[x][y-1]
                )/4)) / (1 + diff_step);
                densities[x][y] = a;
            }
        }
    }

    // Advection
    
    // Clearing Divergence
    
    

    
    // Calculate fps
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    currentfps = (1 / secondsPassed).toFixed(2);
    ctx.fillStyle = 'white';
    ctx.fillRect(fpsShift + 50, 0, 110, 40);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("FPS: " + currentfps, fpsShift + 60, 30);
}
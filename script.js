const canvas = document.getElementById("my-canvas")
const ctx = canvas.getContext("2d")

const n = 2000; // number of particles
const dt = 0.025; //deltatime- decides the overall 'speed' of the simulation.
const frictionHalflife = 0.040 // time taken for velocity to lase half its value.
const m = 6; //number of colors
const rMax = 0.1
const matrix = makeRandomMatrix()
const frictionfactor = Math.pow(0.5, dt/frictionHalflife)
const forcefactor = 20

//particle properties start here
const colors = new Int32Array(n)
const postionsX = new Float32Array(n)
const postionsY = new Float32Array(n)
const velocitiesX = new Float32Array(n)
const velocitiesY = new Float32Array(n)


for (let i = 0; i < n; i++) {
    colors[i]= Math.floor(Math.random()*m)
    postionsX[i]=Math.random()
    postionsY[i]=Math.random()
    velocitiesX[i]=0
    velocitiesY[i]=0

    
}


//
function loop()
{
    updateParticles()
   //render Particles

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    for (let i = 0; i < n; i++) {
        ctx.beginPath()
       const screenX = postionsX[i] * canvas.width
       const screenY = postionsY[i] * canvas.height
       ctx.arc(screenX,screenY,1,0,2*Math.PI)
       ctx.fillStyle = `hsl(${360*(colors[i]/m)},100%,50%)`
       ctx.fill()
    }

    requestAnimationFrame(loop) 
}

requestAnimationFrame(loop) 


function updateParticles(){
    //update velocitis
 for (let i = 0; i < n; i++) {
    let TotalforceX=0
    let TotalforceY=0
    for (let j = 0; j < n; j++) {
        if(j==1)
        continue
    const dx = postionsX[j] - postionsX[i]
    const dy = postionsY[j] - postionsY[i]
    const r = Math.hypot(dx,dy)
    if (r>0&&r<rMax){
        const f= force(r/rMax, matrix[colors[i]][colors[j]])
        TotalforceX += dx/r*f
        TotalforceY += dy/r*f
    }
    }

    TotalforceX *= rMax * forcefactor;
    TotalforceY *= rMax * forcefactor;

    velocitiesX[i] *= frictionfactor;
    velocitiesY[i] *= frictionfactor;

    velocitiesX[i] += TotalforceX * dt
    velocitiesY[i] += TotalforceY * dt

 }

    //update positions
    for (let i = 0; i < n; i++) {
        postionsY[i] += velocitiesX[i] * dt
        postionsY[i] += velocitiesY[i] * dt
}
}

function force(r,a){
    const beta=0.3
    if(r<beta)
    {
        return r/beta - 1
    }

    else if (beta<r&&r<1)
    {
        return a*(1-Math.abs(2*r-1-beta)/(1-beta))
    }
    else {
        return 0
    }

}
    


//

function makeRandomMatrix() {

    const rows = [];
    for(let i =0;i<m;i++)
    {
        const row =[]
        for (let j = 0; j < n; j++) {
            row.push(Math.random()*2 - 1)  
            
        }

        rows.push(row);

    }
    return rows;
}


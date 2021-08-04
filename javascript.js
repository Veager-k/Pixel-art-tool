/*
    To add:
    input via hover or click
    color
    shading
    scaling pixel count
    appealing visual design
    grid toggle
*/

const grid = document.querySelector(".grid");

for(let i=0;i<16*16;i++){
    const div = document.createElement("div");
    div.style.border = "0.05em solid black";
    div.style.backgroundColor = "white";
    div.dataset.hue = 0;
    div.dataset.sat = 0;
    div.dataset.shade = 100;
    div.addEventListener("mouseover", (e) => color_cell(e));
    div.classList.add("cell");
    div.id = i;
    grid.appendChild(div);
}

function color_cell(e){
    if(rainbowMode){
        let newColor = Math.random()*360;
        e.target.dataset.hue = newColor;
        e.target.dataset.sat = 100;
        e.target.dataset.shade = 50;
        e.target.style.backgroundColor = `hsl(${newColor}, 100%, 50%)`;

    }
    else if(shadeMode){
        e.target.dataset.shade = parseInt(e.target.dataset.shade)-10;
        // if a cell is shaded to full white > reset saturation
        if(e.target.dataset.shade<=0){
            e.target.dataset.shade = 0;
            e.target.dataset.sat = 0;
        }
        e.target.style.backgroundColor = `hsl(${e.target.dataset.hue}, ${e.target.dataset.sat}%, ${e.target.dataset.shade}%)`;
    }
    else if(lightMode){
        e.target.dataset.shade = parseInt(e.target.dataset.shade)+10;
        // if a cell is shaded to full white > reset saturation
        if(e.target.dataset.shade>=100){
            e.target.dataset.shade = 100;
            e.target.dataset.sat = 0;
        }
        e.target.style.backgroundColor = `hsl(${e.target.dataset.hue}, ${e.target.dataset.sat}%, ${e.target.dataset.shade}%)`;
    }
    else{
        e.target.style.backgroundColor = "black";
        e.target.dataset.sat = 0;
        e.target.dataset.shade = 0;
    }
}

//rainbow toggle
let rainbowMode = false;
const rainbowButton = document.querySelector("#rainbowButton");
rainbowButton.addEventListener("click", () => toggleRainbow())
function toggleRainbow(){
    if(rainbowMode) rainbowMode = false;
    else{
        rainbowMode = true;
        //resets other buttons so modes don't overlap
        shadeMode = false;
        lightMode = false;
    }
}

// shade toggle
let shadeMode = false;
const shadeButton = document.querySelector("#shadeButton");
shadeButton.addEventListener("click", () => toggleShade());
function toggleShade(){
    if(shadeMode) shadeMode = false;
    else{
        shadeMode = true;
        //resets other buttons so modes don't overlap
        rainbowMode = false;
        lightMode = false;
    }
}

//lighten toggle
let lightMode = false;
const lightButton = document.querySelector("#lightButton");
lightButton.addEventListener("click", () => toggleLight());
function toggleLight(){
    if(lightMode) lightMode = false;
    else{
        lightMode = true;
        //resets other buttons so modes don't overlap
        rainbowMode = false;
        shadeMode = false
    }
}

//clear grid function + button
const clearButton = document.querySelector("#clearButton");
clearButton.addEventListener("click", ()=>clear());
function clear(){
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach((cell)=>{
        cell.dataset.hue = 0;
        cell.dataset.sat = 0;
        cell.dataset.shade = 100;
        cell.style.backgroundColor = "white";
    })
}
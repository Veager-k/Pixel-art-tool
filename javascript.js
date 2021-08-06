/*
    To add:
    color
    color mode button
    appealing visual design
    grid toggle
*/

const grid = document.querySelector(".grid");
const gridSlider = document.querySelector("#gridSlider");
const colorPickerLabel = document.querySelector("#colorPickerLabel");
const colorPicker = document.querySelector("#colorPicker");
colorPicker.addEventListener("input", (e) => updateColorLabel(e));

function updateColorLabel(e){
    colorPickerLabel.style.backgroundColor = e.target.value;
    console.log(e.target.value);
}

function convertRGBtoHSL(rgb){
    rgb = rgb.slice(4).split(",");
    let r = parseInt(rgb[0])/255;
    let g = parseInt(rgb[1].trim())/255;
    let b = parseInt(rgb[2].replace(")"," ").trim())/255;

    let Xmax = Math.max(r, g, b);
    let Xmin = Math.min(r, g, b);
    let chroma = Xmax-Xmin;
    let hue, sat, light = (Xmax+Xmin)/2;

    if(chroma===0) hue = 0;
    else switch(Xmax){
        case r: hue = (g-b)/chroma + (g < b ? 6 : 0); break;
        case g: hue = 2+(b-r)/chroma; break;
        case b: hue = 4+(r-g)/chroma; break;
    }
    hue /= 6;

    if(light===0 || light===1) sat = 0;
    else sat = light > 0.5 ? chroma/(2-Xmax-Xmin) : chroma/(Xmax+Xmin);
    
    hue = Math.round(hue*360);
    sat *= 100;
    light *= 100;
}

function generateGrid(){
    while(grid.firstChild){
        grid.lastChild.removeEventListener("mouseover", (e) => color_cell(e));
        grid.removeChild(grid.lastChild);
    }
    grid.style.gridTemplateRows = `repeat(${gridSlider.value}, 1fr)`;
    grid.style.gridTemplateColumns = `repeat(${gridSlider.value}, 1fr)`;
    for(let i=0;i<gridSlider.value*gridSlider.value;i++){
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
}
generateGrid();

function color_cell(e){
    convertRGBtoHSL(window.getComputedStyle( e.target ,null).getPropertyValue('background-color'));
    if(rainbowMode){
        let newColor = Math.random()*360;
        e.target.dataset.hue = newColor;
        e.target.dataset.sat = 100;
        e.target.dataset.shade = 50;
        e.target.style.backgroundColor = `hsl(${newColor}, 100%, 50%)`;

    }
    else if(shadeMode){
        e.target.dataset.shade = parseInt(e.target.dataset.shade)-15;
        // if a cell is shaded to full white > reset saturation
        if(e.target.dataset.shade<=0){
            e.target.dataset.shade = 0;
            e.target.dataset.sat = 0;
        }
        e.target.style.backgroundColor = `hsl(${e.target.dataset.hue}, ${e.target.dataset.sat}%, ${e.target.dataset.shade}%)`;
    }
    else if(lightMode){
        e.target.dataset.shade = parseInt(e.target.dataset.shade)+15;
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
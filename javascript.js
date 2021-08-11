const grid = document.querySelector(".grid");
const gridSlider = document.querySelector("#gridSlider");
const gridSliderValues = document.querySelector("#gridSliderValues");
const colorPickerLabel = document.querySelector("#colorPickerLabel");
const colorPicker = document.querySelector("#colorPicker");
colorPicker.addEventListener("input", (e) => updateColorLabel(e));
colorPicker.addEventListener("input", (e) => disableModes());

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
    return [hue, sat, light];
}

function generateGrid(){
    while(grid.firstChild){
        grid.lastChild.removeEventListener("mouseover", (e) => color_cell(e));
        grid.removeChild(grid.lastChild);
    }
    grid.style.gridTemplateRows = `repeat(${gridSlider.value}, 1fr)`;
    grid.style.gridTemplateColumns = `repeat(${gridSlider.value}, 1fr)`;
    for(let i=0;i<gridSlider.value**2;i++){
        const div = document.createElement("div");
        div.style.borderTop = "0.1em solid black";
        div.style.borderLeft = "0.1em solid black";
        if((i+1)%gridSlider.value===0) div.style.borderRight = "0.1em solid black";
        if((i+1)>(gridSlider.value**2-gridSlider.value)) div.style.borderBottom = "0.1em solid black";
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

let chosenColor = "black";
function updateColorLabel(e){
    colorPickerLabel.style.backgroundColor = e.target.value;
    chosenColor = e.target.value;
    console.log(e.target.value);
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
        let HSL = convertRGBtoHSL(window.getComputedStyle( e.target ,null).getPropertyValue('background-color'));
        HSL[2] -= 15;
        e.target.style.backgroundColor = `hsl(${HSL[0]}, ${HSL[1]}%, ${HSL[2]}%)`;
    }
    else if(lightMode){
        let HSL = convertRGBtoHSL(window.getComputedStyle( e.target ,null).getPropertyValue('background-color'));
        HSL[2] += 15;
        e.target.style.backgroundColor = `hsl(${HSL[0]}, ${HSL[1]}%, ${HSL[2]}%)`;
    }
    else{
        e.target.style.backgroundColor = chosenColor;
        e.target.dataset.sat = 0;
        e.target.dataset.shade = 0;
    }
}

//resets coloring modes so they don't overlap
function disableModes(){
    rainbowMode = false;
    shadeMode = false;
    lightMode = false;
    rainbowButton.style.backgroundColor = "#513B41";
    shadeButton.style.backgroundColor = "#513B41";
    lightButton.style.backgroundColor = "#513B41";
}

//default mode toggle
//const colorModeButton = document.querySelector("#colorModeButton");
//colorModeButton.addEventListener("click", () => disableModes());

//rainbow toggle
let rainbowMode = false;
const rainbowButton = document.querySelector("#rainbowButton");
rainbowButton.addEventListener("click", () => toggleRainbow())
function toggleRainbow(){
    if(rainbowMode) disableModes();
    else{
        disableModes()
        rainbowMode = true;
        rainbowButton.style.backgroundColor = "#e27e36";
    }
}

// shade toggle
let shadeMode = false;
const shadeButton = document.querySelector("#shadeButton");
shadeButton.addEventListener("click", () => toggleShade());
function toggleShade(){
    if(shadeMode) disableModes();
    else{
        disableModes()
        shadeMode = true;
        shadeButton.style.backgroundColor = "#e27e36";
    }
}

//lighten toggle
let lightMode = false;
const lightButton = document.querySelector("#lightButton");
lightButton.addEventListener("click", () => toggleLight());
function toggleLight(){
    if(lightMode) disableModes();
    else{
        disableModes()
        lightMode = true;
        lightButton.style.backgroundColor = "#e27e36";
    }
}

//grid toggle
let gridOn = true;
const gridButton = document.querySelector("#gridButton");
gridButton.addEventListener("click", ()=>toggleGrid());
function toggleGrid(){
    if(gridOn){
        const allCells = document.querySelectorAll(".cell");
        allCells.forEach((cell)=>{ cell.style.borderWidth = "0px";})
        gridOn = false;
        gridButton.style.backgroundColor = "#513B41";
    }
    else{
        const allCells = document.querySelectorAll(".cell");
        allCells.forEach((cell)=>{cell.style.borderWidth = "0.1em"})
        gridOn = true;
        gridButton.style.backgroundColor = "#e27e36";
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

//displays the currently selected grid size
gridSlider.addEventListener("input", ()=> gridSliderValues.innerText = `Grid Size: ${gridSlider.value} x ${gridSlider.value}`);


const grid = document.querySelector(".grid");

for(let i=0;i<16*16;i++){
    const div = document.createElement("div");
    div.style.backgroundColor = "black";
    div.id = i;
    grid.appendChild(div);
}

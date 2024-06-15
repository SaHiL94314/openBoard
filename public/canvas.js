let canvas=document.querySelector("canvas");
let allPencilcolors=document.querySelectorAll(".pencil-col");
let pencilwidthElem=document.querySelector(".pencilwidth");
let eraserWidthElem=document.querySelector(".eraserwidth");
let download=document.querySelector(".download");
let redo=document.querySelector(".redo");
let undo=document.querySelector(".undo");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

//api
let tool=canvas.getContext("2d");
let undoRedoTracker=[];
let track=0;

// tool.lineWidth="3";//width of line
// tool.strokeStyle="blue"; // line color
// tool.beginPath();//beginning of new <graphics />
// tool.moveTo(100,10);//start point
// tool.lineTo(100,150);//end point
// tool.stroke();//fill color

// // tool.strokeStyle="red";
// // tool.beginPath();
// // tool.moveTo(150,100);
// tool.lineTo(200,250);
// tool.stroke();


let pencilColor="red";
let pencilWidth="3";

let eraserColor="white";
let eraserWidth="3";

let mouseFlag=false;
canvas.addEventListener("mousedown",(e)=>{
    mouseFlag=true;
    let data={
        x:e.clientX,
        y:e.clientY
    };
    socket.emit("beginPath",data);//sending to server 
})

function beginPath(obj){
    tool.beginPath();
    tool.moveTo(obj.x,obj.y);
}
canvas.addEventListener("mousemove",(e)=>{
    
    if(mouseFlag){
        let col=eraserFlag?eraserColor:pencilColor;
        let w=eraserFlag?eraserWidth:pencilWidth;
        let data={
            x:e.clientX,
            y:e.clientY,
            col,
            w
        }
        
        socket.emit("drawStroke",data);//sending to server
    }
})
function drawStroke(data){
    tool.lineTo(data.x,data.y);
    tool.stroke();
    tool.strokeStyle=data.col;
    tool.lineWidth=data.w;
}
canvas.addEventListener("mouseup",(e)=>{
    mouseFlag=false;

    let url=canvas.toDataURL();
    undoRedoTracker.push(url);
    track=undoRedoTracker.length-1;
})
undo.addEventListener("click",(e)=>{
    if(track>0) track--;

    let data={
        trackval:track,
        undoRedoTracker
    }
    // performActions(trackobj);
    socket.emit("undoRedo",data);
})
redo.addEventListener("click",(e)=>{
    if(track<undoRedoTracker.length-1) track++;
    
    let data={
        trackval:track,
        undoRedoTracker
    }
    // performActions(trackobj);
    socket.emit("undoRedo",data);

})
function performActions(trackobj){
    track=trackobj.trackval;
    undoRedoTracker=trackobj.undoRedoTracker;
    tool.clearRect(0, 0, canvas.width, canvas.height);
    let url=undoRedoTracker[track];
    let img=new Image();
    img.src=url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

allPencilcolors.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        pencilColor=colorElem.classList[0];
    })
})
pencilwidthElem.addEventListener("change",(e)=>{
    pencilWidth=pencilwidthElem.value;
})
eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth=eraserWidthElem.value;
})
download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})
socket.on("beginPath",(data)=>{
    beginPath(data);
})
socket.on("drawStroke",(data)=>{
    drawStroke(data);
})
socket.on("undoRedo",(data)=>{
    performActions(data);
})
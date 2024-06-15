let pencil=document.querySelector(".pencil");
let pencilCont=document.querySelector(".pencil-cont");
let eraser=document.querySelector(".eraser");
let eraserCont=document.querySelector(".eraser-cont");
let optionsCont=document.querySelector(".options-cont");
let toolBoxCont=document.querySelector(".tool-box-cont");
let stickynote=document.querySelector(".stickynote");
let upload=document.querySelector(".upload");


let pencilFlag=false;
let eraserFlag=false;
let hamBurger=true;
optionsCont.addEventListener("click",(e)=>{
    hamBurger=!hamBurger;
    if(hamBurger) openTools();
    else closeTools();
})
function openTools(){
    let imgTag=optionsCont.children[0];
    imgTag.classList.remove("fa-xmark");
    imgTag.classList.add("fa-bars");
    toolBoxCont.style.display="flex";
}
function closeTools(){
    let imgTag=optionsCont.children[0];
    imgTag.classList.remove("fa-bars");
    imgTag.classList.add("fa-xmark");
    toolBoxCont.style.display="none";

    pencilCont.style.display="none";
    eraserCont.style.display="none";
}
pencil.addEventListener("click",(e)=>{
    pencilFlag=!pencilFlag;
    if(pencilFlag) pencilCont.style.display="block";
    else pencilCont.style.display="none";
})
eraser.addEventListener("click",(e)=>{
    eraserFlag=!eraserFlag;
    if(eraserFlag) eraserCont.style.display="flex";
    else eraserCont.style.display="none";
})
upload.addEventListener("click",(e)=>{
    //open file explorer
    let inputE=document.createElement("input");
    inputE.setAttribute("type","file");
    inputE.click();

    inputE.addEventListener("change",(e)=>{
        let file=inputE.files[0];
        let url=URL.createObjectURL(file);

        
        
        let stickyTemplate=`
            <div class="header-cont">
                    <div class="minimize"></div>
                    <div class="remove"></div>
                </div>
                <div class="notes-cont">
                    <img src="${url}">
                </div>
        `;

        createSticky(stickyTemplate);
        
    })
})
stickynote.addEventListener("click",(e)=>{
    let stickyTemplate=`
        <div class="header-cont">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="notes-cont">
                <textarea spellcheck="false"></textarea>
            </div>
    `;
    createSticky(stickyTemplate);
    
})

function createSticky(stickyTemplate){
    let stickycont=document.createElement("div");
    stickycont.setAttribute("class","sticky-cont");
    stickycont.innerHTML=stickyTemplate;
    document.body.appendChild(stickycont);

    let minimize=stickycont.querySelector(".minimize");
    let remove=stickycont.querySelector(".remove");

    headerActions(minimize,remove,stickycont);

    stickycont.onmousedown = function(event) {

        dragAndDrop(event,stickycont);
      
      };
      
      stickycont.ondragstart = function() {
        return false;
      };
}
function dragAndDrop(event,stickycont){
    let shiftX = event.clientX - stickycont.getBoundingClientRect().left;
    let shiftY = event.clientY - stickycont.getBoundingClientRect().top;
  
    stickycont.style.position = 'absolute';
    stickycont.style.zIndex = 1000;
    
  
    moveAt(event.pageX, event.pageY);
  
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        stickycont.style.left = pageX - shiftX + 'px';
        stickycont.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // drop the ball, remove unneeded handlers
    stickycont.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      stickycont.onmouseup = null;
    };
}

function headerActions(minimize,remove,stickycont){

    remove.addEventListener("click",(e)=>{
        stickycont.remove();
    })
    minimize.addEventListener("click",(e)=>{
        let notescont=stickycont.querySelector(".notes-cont");
        let dis=getComputedStyle(notescont).getPropertyValue("display");
        if(dis=="none") notescont.style.display="block";
        else notescont.style.display="none";
    })
}

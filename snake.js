function draw(){
    document.addEventListener("keydown", move);
    const image = document.getElementById('source');
    setTimeout(game, 1000/speed);//run 13 times a sec
}
var pause ={
    x:500,
    y:400,
    xv:0,
    yv:0
}
function generateButton(){
    var ang = Math.floor(Math.random()*360);
    pause.x = 450;
    pause.y = 425;
    pause.xv = 10*Math.cos(ang);
    pause.yv = 10*Math.sin(ang);
}
var xv = 0;
var yv = 0;
var gs = 40;
var speed = gs/3;
var px = Math.floor(gs/3);
var py = Math.floor(gs/2);
var ax = Math.floor(2*gs/3);
var ay = Math.floor(gs/2);
var trail = 5;
var tail = [{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py}];
var mult = 0;
var skip = false;
var good = [];
var bad = false;
var big = 0;
var paused = false;
function reset(){
    ctx.drawImage(image, 0,0,canvas.width,canvas.height);//walls kill
    ctx.fillStyle = "#00f000";
    ctx.fillRect(px*mult,py*mult,mult - mult/20,mult-mult/20);
    if(trail>big){
        big = trail;
        var high = document.getElementById("score");
        high.innerHTML = "High Score: " + big;
    }
    tail = [{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py}];
    trail = 5;
    xv = 0;
    yv = 0;
    px = Math.floor(gs/3);
    py = Math.floor(gs/2);
    ax = Math.floor(2*gs/3);
    ay = Math.floor(gs/2);
}
function wall(){
    if(px+xv<-1){           //wall will kill you
        reset();            //^^^^^^^^^^^^^^^^^^
        return(true);       //^^^^^^^^^^^^^^^^^^
    }else if (px+xv>gs){    //^^^^^^^^^^^^^^^^^^
        reset();            //^^^^^^^^^^^^^^^^^^
        return(true);       //^^^^^^^^^^^^^^^^^^
    }                       //^^^^^^^^^^^^^^^^^^
    if(py+yv<-1){           //^^^^^^^^^^^^^^^^^^
        reset();            //^^^^^^^^^^^^^^^^^^
        return(true);       //^^^^^^^^^^^^^^^^^^
    }else if(py+yv > gs){   //^^^^^^^^^^^^^^^^^^
        reset();            //^^^^^^^^^^^^^^^^^^
        return(true);       //^^^^^^^^^^^^^^^^^^
    }
    return(false);
}
function game(){
    
    if(skip){//handles issues with input
        skip = false;
        return;
    }
    if(!paused){
        speed = 13
    }
    canvas = document.getElementById("game");
    ctx = canvas.getContext('2d');
    mult = canvas.width / gs;
    image = document.getElementById('source');
    ctx.drawImage(image, 0,0,canvas.width,canvas.height);//draw background
    good = [];
    for(var i = 0; i<gs;i++){//create a lookup table of valid positions for an apple
        for(var j = 0; j< gs;j++){
            for(var k = 0; k< tail.length;k++){
                if(tail[k].x ==i && tail[k].y == j){
                    bad = true;
                }
            }
            if(!bad){
                good.push({x:i,y:j});
            }
            bad = false;
        }
    }
    if(wall()){
        setTimeout(game, 1000/speed);//call next frame
        return;
    }
    if(!paused){//pnly move if not paused
        px+=xv;
        py+=yv;
    }
    if(ax == px && ay == py){//handles eating and generating apples
        trail++;
        tail[trail-1] = {x:tail[trail-2].x,y:tail[trail-2].y};
        var rand = Math.floor(Math.random()*good.length);
        ax = good[rand].x;
        ay = good[rand].y;
    }
    ctx.fillStyle = "#00ff00";
    for(var i = 0; i< trail; i++){
        ctx.fillRect(tail[i].x*mult,tail[i].y*mult,mult - mult/20,mult-mult/20);//draw tail
        if(!paused){
            if(tail[i].x ==px && tail[i].y == py){//reset upon death
                reset();
            }
        }
    }
    if(!paused){
        tail.push({x:px,y:py});//add current pos to front of snake
        while(tail.length>trail){
            tail.shift();//chop off end of snake
        }
    }
    ctx.fillStyle = "#ff0000";//draw apple
    ctx.fillRect(ax*mult,ay*mult,mult-mult/20,mult-mult/20);
    if(paused){
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pause.x-20, pause.y, 50, 175);
        ctx.fillRect(pause.x+70, pause.y, 50, 175);
        //render pause button
    }
    setTimeout(game, 1000/speed);//call next frame
    
    var curr = document.getElementById('current');
    curr.innerHTML = "Score: "+ tail.length;//update score
    
}
function move(evt){//handles movement
    wall();
    switch(evt.code){
        case "KeyA":
        case "ArrowLeft":
            
            if(xv!=1 && !paused){
                xv = -1;
                yv = 0;
            }
            break;
        case "KeyW":
        case "ArrowUp":
            if(yv!=1 && !paused){
                xv = 0;
                yv = -1;
            }
            
            break;
        case "KeyD":
        case "ArrowRight":
            if(xv!=-1 && !paused){
                xv = 1;
                yv = 0;
            }
            break;
        case "KeyS":
        case "ArrowDown":
            if(yv!=-1 && !paused){
                xv = 0;
                yv = 1;
            }
            break;
        case "Escape":
        case "KeyP":
            if(!paused){
                generateButton();
                paused = true;
            }else{
                paused = false;
            }
    }
    game();//prevents multiple movements per frame
    skip = true;
    
    
}
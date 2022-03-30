function draw(){
    document.addEventListener("keydown", move);
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
var vels = [{xv:0,yv:0}];
var gs = 20;
var speed = gs/2.5;
var px = Math.floor(gs/3);
var py = Math.floor(gs/2);
var ax = Math.floor(2*gs/3);
var ay = Math.floor(gs/2);
var trail = 4;
var tail = [{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py}];
var mult = 1000/gs;
var good = [];
var bad = false;
var big = 0;
var paused = false;
var PUPIL_SIZE = mult/6;
var EYE_SIZE = mult/4;
function reset(){
    drawBack(ctx);
    ctx.fillStyle = "#00f000";
    ctx.fillRect(px*mult+(mult/40),py*mult+(mult/40),mult - mult/20,mult-mult/20);
    if(trail>big){
        big = trail;
        var high = document.getElementById("score");
        high.innerHTML = "High Score: " + big;
    }
    tail = [{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py}];
    trail = 4;
    xv = 0;
    yv = 0;
    vels = [{xv:0,yv:0}];
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
function drawBack(ctx){
    mult = canvas.width/gs;
    for(var i = 0; i< gs; i++){
        for(var j = 0; j<gs; j++){
            if((i+j)%2 == 0){
                ctx.fillStyle = "#0000aa";
            }
            else{
                ctx.fillStyle = "#5050aa";
            }
            ctx.fillRect(i*mult,j*mult,mult,mult);//draw background
        }
    }
}
function game(){
    canvas = document.getElementById("game");
    ctx = canvas.getContext('2d');
    mult = canvas.width / gs;
    drawBack(ctx);;//draw background
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
        if(vels.length>0){
            xv = vels[0].xv;
            yv = vels[0].yv;
            vels.shift();
        }
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
    ctx.fillRect(px*mult+(mult/40),py*mult+(mult/40),mult-mult/20,mult-mult/20);
    ctx.fillRect((px-xv/2)*mult+(mult/40),(py-yv/2)*mult+(mult/40),mult-mult/20,mult-mult/20);
    for(var i = 1; i< trail-1; i++){
        var xoff =  tail[i+1].x - tail[i].x;
        var yoff = tail[i+1].y - tail[i].y;
        xoff/=2;
        yoff/=2;
        ctx.fillRect((tail[i].x+xoff)*mult+mult/40,(tail[i].y+yoff)*mult+(mult/40), mult-mult/20,mult-mult/20);
        ctx.fillRect(tail[i].x*mult + (mult/40),tail[i].y*mult + (mult/40),mult - mult/20,mult-mult/20);//draw tail
        if(!paused){
            if(tail[i].x ==px && tail[i].y == py && trail>4){//reset upon death
                reset();
            }
        }
    }
    ctx.fillRect(tail[trail-1].x*mult+(mult/40),tail[trail-1].y*mult+(mult/40),mult-mult/20,mult-mult/20);
    drawEyes();
    if(!paused){
        tail.push({x:px,y:py});//add current pos to front of snake
        while(tail.length>trail){
            tail.shift();//chop off end of snake
        }
    }
    ctx.fillStyle = "#ff0000";//draw apple
    ctx.fillRect(ax*mult+ (mult/40),ay*mult + (mult/40),mult-mult/20,mult-mult/20);
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
function drawEyes(){
    ctx.fillStyle = "#ffffff";
    if(Math.abs(yv)>0){
        if(yv<0){
            ctx.fillRect((px+0.1)*mult+mult/40,(py+0.5)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillRect((px+0.6)*mult+mult/40,(py+0.5)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillStyle = "#000000";
            ctx.fillRect((px+0.1)*mult+mult/40,(py+0.5)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
            ctx.fillRect((px+0.6)*mult+mult/40,(py+0.5)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
        }
        else{
            ctx.fillRect((px+0.1)*mult+mult/40,(py+0.5)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillRect((px+0.6)*mult+mult/40,(py+0.5)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillStyle = "#000000";
            ctx.fillRect((px+0.1)*mult+mult/40,(py+0.5)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
            ctx.fillRect((px+0.6)*mult+mult/40,(py+0.5)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
            
        }
    }else{
        if(xv<0){
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.1)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.6)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillStyle = "#000000";
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.1)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.6)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
        }else{
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.1)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.6)*mult+mult/40,EYE_SIZE,EYE_SIZE);
            ctx.fillStyle = "#000000";
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.1)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
            ctx.fillRect((px+0.5)*mult+mult/40,(py+0.6)*mult+mult/40,PUPIL_SIZE,PUPIL_SIZE);
        }
    }
}
function move(evt){//handles movement
    wall();
    switch(evt.code){
        case "KeyA":
        case "ArrowLeft":
            if(vels.length>0){
                if(!paused && vels[vels.length-1].xv != 1){
                    vels.push({xv:-1,yv:0});
                }
            }
            else if(xv!= 1 && !paused){
                vels.push({xv:-1,yv:0});
            }
            break;
        case "KeyW":
        case "ArrowUp":
            if(vels.length>0){
                if(!paused&& vels[vels.length-1].yv != 1){
                    vels.push({xv:0,yv:-1});
                }
            }
            else if(yv!=1 && !paused){
                vels.push({xv:0,yv:-1});
            }
            
            break;
        case "KeyD":
        case "ArrowRight":
            if(vels.length>0){
                if(!paused && vels[vels.length-1].xv != -1){
                    vels.push({xv:1,yv:0});
                }
            }
            else if(xv!= -1 && !paused){
                vels.push({xv:1,yv:0});
            }
            break;
        case "KeyS":
        case "ArrowDown":
            if(vels.length>0){
                if(!paused & vels[vels.length-1].yv != -1){
                    vels.push({xv:0,yv:1});
                }
            }else if(yv!= -1 && !paused){
                vels.push({xv:0, yv: 1});
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
            break;
    }
    
}
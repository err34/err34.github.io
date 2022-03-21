var speed = 13;
function draw(){
    document.addEventListener("keydown", move);
    const image = document.getElementById('source');
    setInterval(game, 1000/speed);//run 13 times a sec
}
var xv = 0;
var yv = 0;
var px = 10;
var py = 10;
var ax = 15;
var ay = 10
var gs = 20;
var tc = 20;
var trail = 5;
var tail = [{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py}];
var mult = 0;
var skip = false;
var good = [];
var bad = false;
var big = 0;
function game(){
    if(skip){//handles issues with input
        skip = false;
        return;
    }
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    mult = canvas.width / gs;
    var image = document.getElementById('source');
    ctx.drawImage(image, 0,0,canvas.width,canvas.height);//draw background
    good = [];
    for(var i = 0; i<gs;i++){
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
    if(ax ==px && ay == py){
        trail++;
        tail[trail-1] = {x:tail[trail-2].x,y:tail[trail-2].y};
        var rand = Math.floor(Math.random()*good.length);
        ax = good[rand].x;
        ay = good[rand].y;
        //logic for generating new apple if in tail
    }
    px+=xv;
    py+=yv;
    if(px<0){
        px = tc-1;//screen wrap
    }else if (px>tc-1){
        px = 0;
    }
    if(py<0){
        py = tc-1;
    }else if(py > tc-1){
        py = 0;
    }
    ctx.fillStyle = "#00f000";
    for(var i = 0; i< trail; i++){
        ctx.fillRect(tail[i].x*mult,tail[i].y*mult,gs*2,gs*2);//draw tail
        if(tail[i].x ==px && tail[i].y == py){//reset upon death
            ctx.drawImage(image, 0,0,canvas.width,canvas.height);
            ctx.fillStyle = "#00f000";
            ctx.fillRect(px*mult,py*mult,gs*2,gs*2);
            if(trail>big){
                big = trail;
                var high = document.getElementById("score");
                high.innerHTML = "High Score: " + big;
            }
            tail = [{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py},{x: px, y: py}];
            trail = 5;
            xv = 0;
            yv = 0;
            px = 10;
            py = 10;
            ax = 15;
            ay = 10;
        }
    }
    tail.push({x:px,y:py});//add current pos to front of snake
    while(tail.length>trail){
        tail.shift();//chop off end of snake
    }
    ctx.fillStyle = "#ff0000";//draw apple
    ctx.fillRect(ax*mult,ay*mult,gs*2,gs*2);
    
}
function move(evt){//handles movement
    switch(evt.code){
        case "KeyA":
        case "ArrowLeft":
            if(xv!=1){
                xv = -1;
                yv = 0;
            }
            break;
        case "KeyW":
        case "ArrowUp":
            if(yv!=1){
                xv = 0;
                yv = -1;
            }
            
            break;
        case "KeyD":
        case "ArrowRight":
            if(xv!=-1){
                xv = 1;
                yv = 0;
            }
            break;
        case "KeyS":
        case "ArrowDown":
            if(yv!=-1){
                xv = 0;
                yv = 1;
            }
            break;
    }
    game();
    skip = true;//prevents moving multiple times a frame
}
function draw(){
    document.addEventListener("keydown", move);
    const image = document.getElementById('source');
    setInterval(game, 1000/15);
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
var tail = [{x: px, y: py},{x:9, y:10},{x:8, y:10}, {x: 7, y:10},{x:6,y:10}];
var mult = 0;
var skip = false;
function game(){
    if(skip){
        skip = false;
        return;
    }
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    mult = canvas.width / gs;
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
    ctx.drawImage(image, 0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#00ff00";
    for(var i = 0; i< trail; i++){
        ctx.fillRect(tail[i].x*mult,tail[i].y*mult,gs-2,gs-2);
        if(tail[i].x ==px && tail[i].y == py){
            ctx.drawImage(image, 0,0,canvas.width,canvas.height);
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(px*mult,py*mult,gs-2,gs-2);
            trail = 5;
            xv = 0;
            yv = 0;
            px = 10;
            py = 10;
            ax = 15;
            ay = 10;
        }
    }
    tail.push({x:px,y:py});
    while(tail.length>trail){
        tail.shift();
    }
    if(ax ==px && ay == py){
        trail++;
        tail[trail-1] = {x:tail[trail-2].x-xv,y:tail[trail-2].y-yv};
        ax = Math.floor(Math.random()*tc);
        ay = Math.floor(Math.random()*tc);
        for(var i = 0; i< trail; i++){
            if(tail[i].x == ax && tail[i].y == ay){
                ax = px+ Math.floor(Math.random*5);
                if(ax > gs-1){
                    ax = gs-1;
                }else if (ax<0){
                    ax = 0;
                }
                ay = py+ Math.floor(Math.random*5);
                if(ay > gs-1){
                    ay = gs-1;
                }else if(ay<0){
                    ay = 0;
                }
            }
        }
    }
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(ax*mult,ay*mult,gs-2,gs-2);
    
}
function move(evt){
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
    skip = true;
}
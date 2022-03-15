
function draw(){
    document.addEventListener("keydown",keyPush);
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    setInterval(snake, 1000/15);
}
px=py=10;//player position
gs=tc= 10;//grid size and tile count
ax=ay=15;//apple position
xv = yv = 0;//velocity
trail = [];
tail = 5;
function snake(){
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
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "lime";
    for(var i = 0; i < trail.length;i++){
        ctx.fillRect(trail[i].x*gs, trail[i].y*gs,gs-2,gs-2);
        if(trail[i].x ==px && trail[i].y == py){
            tail = 5;
        }
    }
    trail.push({x:px,y:py});
    while(trail.length >tail){
        trail.shift();
    }
    ctx.fillStyle = "red";
    if(ax ==px && ay == py){
        tail++;
        ax = Math.floor(Math.random()*tc);
        ay = Math.floor(Math.random()*tc);
    }
    ctx.fillRect(ax*gs, ay*gs, gs-2,gs-2);
}
function keyPush(evt){
    switch(evt.keyCode){
        case 65:
            xv = -1;
            yv = 0;
            break;
        case 87:
            xv = 0;
            yv = -1;
            break;
        case 68:
            xv = 1;
            yv = 0;
            break;
        case 83:
            xv = 0;
            yv = 1;
            break;
    }
}
function draw(){
    canvas = document.getElementById("game");
    ctx = canvas.getContext('2d');
    document.addEventListener("keypress", move);
    document.addEventListener("mousemove", cMove);
    width = canvas.width;
    height = canvas.height;
    image = document.getElementById("gamer");
    score = document.getElementById("score");
    high_score = document.getElementById("big");
    mouseDown = 0;
    document.body.onmousedown = function() { 
        mouseDown = 1;
    }
    document.body.onmouseup = function() {
      mouseDown = 0;
    }
    setTimeout(gameTick, 1000/speed);
}
var speed = 50;
var tSpeed = 5;
var tank = {
    x: 500,
    y:500,
    xv:0,
    sxv: 0,
    syv: 0,
    mag: 0,
    yv:0,
    ang:0,
    soffset: 1,
    offset: 30,
    rate: 50,
    width: 50,
    height: 50,
    cooldown: 20,
    damage: 20
};
var enemyHp = 100;
var pursuer = {
    hp: enemyHp,
    x:0,
    y:0,
    xv:0,
    yv:0,
    ang: 0,
    width: 10,
    height: 10,
    speed: 1
};
var mx = 500;
var my = 500;
var bSize = 5;
var cooldown = 0;
var maxSped = 5;
var minSped = -5;
var bullSped = 5;
var turnSpeed = 0.1;
var bullets = [];
var accel = 0.25;
var friction = 0.5;
var points = 0;
var highest = 0;
function gameTick(){
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,width,height);
    score.innerText = "Score: "+ points;
    var ang = tank.ang;
    ctx.fillStyle = "#000000";
    gamer.style.transform = "rotate("+ang+"rad);";
    ctx.drawImage(image, tank.x,tank.y, tank.width,tank.height);
    var nvx = mx -tank.x;
    var nvy = my - tank.y;
    var nang = Math.atan2(nvx+tank.width/2,nvy+tank.height/2); //calc ang to mouse
    if (nang < 0){
        nang += 2*Math.PI;
    }//change range to 0, 2pi
    if (nang < 0){
        nang += 2*Math.PI;
    }
    nang = Math.abs((Math.PI*2.5) - nang); //align angle with canvas
    tank.ang = nang;
    if(mouseDown == 1 && cooldown <= 0){
        cooldown = tank.cooldown;
        shoot();
    }
    tank.x += tank.xv;
    tank.x = tank.x%width;
    if(tank.x + tank.width<0){
        ctx.drawImage(image, tank.x + width, tank.y, tank.width,tank.height);
    }
    if(tank.x < 0){
        tank.x +=width;
    }
    if(tank.x -tank.width>width){
        ctx.drawImage(image,tank.x-width,tank.y,tank.width,tank.height);

    }if(tank.x > width){
        tank.x -= width;
    }
    tank.y += tank.yv;
    tank.y = tank.y%height;
    
    if(tank.y +tank.height <  0){
        ctx.drawImage(image, tank.x,tank.y+height, tank.width,tank.height);
    }if(tank.y < 0){
        tank.y += height;
    }
    if(tank.y + tank.height > height){
        ctx.drawImage(image, tank.x,tank.y - height, tank.width,tank.height);
    }if(tank.y>height){
        tank.y -=height;
    }
    
    bulletMove();
    pMove();
    cooldown--;
    drawCross();
    setTimeout(gameTick, 1000/speed);
}
function bulletMove(){
    for(var i = 0; i< bullets.length; i++){
        bullets[i].x += bullets[i].xv;
        bullets[i].y += bullets[i].yv;
        ctx.fillRect(bullets[i].x, bullets[i].y,bSize,bSize);
        if(bullets[i].x > width || bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].y > height || killPursuer(bullets[i])){
            bullets.splice(i,1);
            i--;
        }
    }
}
function shoot(){
    for(var i = 0; i< tank.rate; i++){
        var ang = tank.ang;
        var off = tank.offset*Math.random() - tank.offset/2;
        var xspeed = tank.soffset*Math.random() - tank.soffset/2;
        var yspeed = tank.soffset*Math.random() - tank.soffset/2;
        off*= (Math.PI/180);
        ang += off;
        var xv = tank.mag*Math.cos(tank.ang);
        var yv = tank.mag*Math.sin(tank.ang);
        var bxv = bullSped*Math.cos(ang)+xspeed + xv;
        var byv = bullSped*Math.sin(ang)+yspeed + yv;
        var bullet = {
            x: tank.x+tank.width/2,
            y: tank.y+tank.height/2,
            xv: bxv,
            yv: byv,
            ang: ang
        };
        bullets.push(bullet);
    }
}
function reset(){
    tank.x = width/2 - tank.width/2;
    tank.y = width/2 - tank.height/2;
    tank.mag = 0;
    tank.xv = 0;
    tank.yv = 0;
    var side = Math.floor(Math.random()*4);
    switch(side){
        case 0:
            pursuer.y = Math.random()*height;
            pursuer.x = 0;
            break;
        case 1:
            pursuer.x = Math.random()*width;
            pursuer.y = 0;
            break;
        case 2:
            pursuer.x = width;
            pursuer.y = Math.random()*height;
            break;
        case 3:
            pursuer.x = Math.random()*width;
            pursuer.y = height;
            break;
    }
    pursuer.hp = 50;
    enemyHp = 50;
    pursuer.speed = 1;
    if(points > highest){
        high_score.innerText = "High score: " + points;
        highest = points;
    }
    points = 0;
}
function pursRes(){
    var side = Math.floor(Math.random()*4);
    switch(side){
        case 0:
            pursuer.y = Math.random()*height;
            pursuer.x = 0;
            break;
        case 1:
            pursuer.x = Math.random()*width;
            pursuer.y = 0;
            break;
        case 2:
            pursuer.x = width;
            pursuer.y = Math.random()*height;
            break;
        case 3:
            pursuer.x = Math.random()*width;
            pursuer.y = height;
            break;
    }if(pursuer.speed< 10){
        pursuer.speed*=1.1;
    }else{
        enemyHp *= 1.1;
    }
}
function killPursuer(bullet){
    if(bullet.x > pursuer.x  && bullet.x < pursuer.x + pursuer.width && bullet.y > pursuer.y && bullet.y < pursuer.y + pursuer.width ){
        pursuer.hp -= tank.damage;
        return true;
    }
    return false;
}
function pMove(){
    if(pursuer.hp <= 0){
        pursRes();
        pursuer.hp = enemyHp;
        points++;
        score.innerText = "Score: " + points;
    }
    if(pursuer.x > tank.x && pursuer.y > tank.y &&  pursuer.x < tank.x + tank.width && pursuer.y < tank.y + tank.height){
        reset();
    }
    var vx = (tank.x + tank.width/2 - pursuer.width/2) - pursuer.x;
    var vy = (tank.y + tank.height/2 - pursuer.width/2) - pursuer.y;
    var ang = Math.atan2(vx,vy);
    while(ang<0){
        ang+=2*Math.PI;
    }
    ang = Math.abs((Math.PI*2.5) - ang);
    pursuer.ang = ang;
    pursuer.xv = pursuer.speed*Math.cos(pursuer.ang);
    pursuer.yv = pursuer.speed*Math.sin(pursuer.ang);
    pursuer.x += pursuer.xv;
    pursuer.y += pursuer.yv;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(pursuer.x,pursuer.y,pursuer.width, pursuer.height);
    ctx.fillStyle = "#000000";
}
function cMove(evt){
    mx = evt.offsetX;
    my = evt.offsetY;
}
function drawCross(){
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(mx-5,my+5,5,20);
    ctx.fillRect(mx-5,my-20,5,20);
    ctx.fillRect(mx-25,my,20,5);
    ctx.fillRect(mx,my,20,5);
}
function tMove(){
    var nvx = mx -tank.x;
    var nvy = my - tank.y;
    var nang = Math.atan2(nvx+tank.width/2,nvy+tank.height/2); //calc ang to mouse
    if (nang < 0){
        nang += 2*Math.PI;
    }//change range to 0, 2pi
    if (nang < 0){
        nang += 2*Math.PI;
    }
    nang = Math.abs((Math.PI*2.5) - nang); //align angle with canvas
    tank.ang = nang;
    var xv = Math.cos(tank.ang) * accel;
    var yv = Math.sin(tank.ang) * accel;
    if(Math.abs(tank.xv + xv) < maxSped && Math.abs(tank.yv + yv) < maxSped ){
        tank.xv += xv;
        tank.yv += yv;
        tank.mag = Math.sqrt((tank.xv*tank.xv)+(tank.yv + tank.yv));
    }
}

function move(evt){
    if(evt.code == "KeyW"){
        tMove();
        
        //move forward
        
    }
    // else if(evt.code == "KeyS"){
    //     if(tank.mag + accel > minSped){
    //         tank.mag -= accel;
    //     }
    //     //moveBack
    // }
    if(evt.code == "KeyA"){
        //turn left
        tank.ang-=turnSpeed;
    }else if(evt.code == "KeyD"){
        //turn right
        tank.ang+=turnSpeed;
    }
    if(evt.code=="Space" && cooldown <=0){
        shoot();
        cooldown = tank.cooldown;
    }
}
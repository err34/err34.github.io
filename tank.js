function draw(){
    canvas = document.getElementById("game");
    ctx = canvas.getContext('2d');
    document.addEventListener("keypress", move);
    document.addEventListener("mousemove", cMove);
    width = canvas.width;
    height = canvas.height;
    image = document.getElementById("gamer");
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
    cooldown: 20
};
var pursuer = {
    x:0,
    y:0,
    xv:0,
    yv:0,
    ang: 0,
    width: 10,
    height: 10,
    speed: 1
};
var bSize = 5;
var cooldown = 0;
var maxSped = 10;
var minSped = -10;
var bullSped = 5;
var turnSpeed = 0.1;
var bullets = [];
var accel = 1;
var friction = 0.1;
function gameTick(){
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,width,height);
    var ang = tank.ang;
    ctx.fillStyle = "#000000";
    gamer.style.transform = "rotate("+ang+"rad);";
    ctx.drawImage(image, tank.x,tank.y, tank.width,tank.height);
    if(mouseDown == 1 && cooldown <= 0){
        cooldown = tank.cooldown;
        shoot();
    }
    tMove();
    if(tank.mag > 0){
        tank.mag -= friction;
    }else if(tank.mag < 0){
        tank.mag += friction;
    }
    bulletMove();
    pMove();
    cooldown--;
    setTimeout(gameTick, 1000/speed);
}
function bulletMove(){
    for(var i = 0; i< bullets.length; i++){
        bullets[i].x += bullets[i].xv;
        bullets[i].y += bullets[i].yv;
        ctx.fillRect(bullets[i].x, bullets[i].y,bSize,bSize);
        if(bullets[i].x > width || bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].y > height){
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
        var bxv = bullSped*Math.cos(ang)+xspeed;
        var byv = bullSped*Math.sin(ang)+yspeed;
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
function pMove(){
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
    var mx = evt.offsetX;
    var my = evt.offsetY;
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
}
function tMove(){
    var xv = tank.mag*Math.cos(tank.ang);
    var yv = tank.mag*Math.sin(tank.ang);
    tank.x += xv;
    tank.y += yv;
}
function move(evt){
    if(evt.code == "KeyW"){
        if(tank.mag < maxSped){
            tank.mag += accel;
        }
        
        //move forward
        
    }
    else if(evt.code == "KeyS"){
        if(tank.mag > minSped){
            tank.mag -= accel;
        }
        //moveBack
    }
    if(evt.code == "KeyA"){
        //turn left
        tank.ang-=turnSpeed;
    }else if(evt.code == "KeyD"){
        //turn right
        tank.ang+=turnSpeed;
    }
    if(evt.code=="Space" && cooldown <=0){
        shoot();
    }
}
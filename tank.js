function draw(){
    canvas = document.getElementById("game");
    ctx = canvas.getContext('2d');
    document.addEventListener("keypress", move);
    document.addEventListener("keyup",moveUp);
    canvas.addEventListener("mousemove", cMove);
    document.addEventListener("mousedown", cShoot);
    document.addEventListener("mouseup",cShot);
    width = canvas.width;
    height = canvas.height;
    score = document.getElementById("score");
    high_score = document.getElementById("big");
    moving = 0;
    shooting = 0;
    setTimeout(gameTick, 1000/speed);
}
function cShoot(evt){
    if(evt.button == 0){
        moving = 1;
    }else if(evt.button  == 2){
        shooting = 1;
    }
    
}
function cShot(evt){
    if(evt.button == 0){
        moving = 0;
    }else if(evt.button == 2){
        shooting = 0;
    }
}function degToRad(ang){
    return ang*(Math.PI/180);
}
var speed = 60;
var bCol = "#000000;";
var kMove = false;
var kShoot = false;
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
    offset: 5,
    rate: 1,
    width: 50,
    height: 50,
    cooldown: 0,
    damage: 40,
    rand:false
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
var enemys = [pursuer];
var mx = 500;
var my = 500;
var bSize = 5;
var cooldown = 0;
var maxSped = 10;
var minSped = -10;
var bullSped = 10;
var turnSpeed = 5;
var bullets = [];
var accel = 0.25;
var friction = 0.05;
var points = 0;                     
var highest = 0;                                                                                                                      
function gameTick(){                                    
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,width,height);
    score.innerText = "Score: "+ points;
    var ang = tank.ang;
    ctx.fillStyle = "#000000";
    
    if(moving == 1 || kMove){
        tMove();
    }
    if((shooting == 1 || kShoot) && cooldown <=0){
        shoot();
        cooldown = tank.cooldown;
    }
    bulletMove();
    drawTank(tank.x,tank.y,tank.width,tank.height);
    tank.x += tank.xv;
    tank.x = tank.x%width;
    if(tank.x-tank.width<0){//screen wrap code until !]
        drawTank(tank.x+width,tank.y,tank.width,tank.height);
    }
    if(tank.x<0){
        tank.x += width;
    }
    if(tank.x+tank.width>width){
        drawTank(tank.x-width,tank.y,tank.width,tank.height);
    }
    if(tank.x > width){
        tank.x -= width;
    }
    tank.y += tank.yv;
    tank.y = tank.y%height;
    if(tank.y-tank.height){
        drawTank(tank.x,tank.y+height,tank.width,tank.height);
    }
    if(tank.y < 0){
        tank.y += height;
    }
    if(tank.y+tank.height > height){
        drawTank(tank.x,tank.y-height,tank.width,tank.height);
    }if(tank.y > height){
        tank.y -= height;
    }
    if(tank.ang>Math.PI*2){
        tank.ang-=Math.PI*2;
    }else if(tank.ang < 0){
        tank.ang += Math.PI*2;
    }//!]
    // console.log(tank.ang);
    pMove();
    cooldown--;//timer for bullets
    drawCross();
    var mang = Math.atan2(tank.xv,tank.yv);
    if (mang < 0){
        mang += 2*Math.PI;
    }//change range to 0, 2pi
    if (mang < 0){
        mang += 2*Math.PI;
    }
    mang = Math.abs((Math.PI*2.5) - mang); //align angle with canvas
    var xv = Math.cos(mang) * friction;
    var yv = Math.sin(mang) * friction;
    tank.mag = Math.sqrt((tank.xv)*(tank.xv)+(tank.yv)*(tank.yv));
    if(Math.abs(tank.mag) > friction){
        if(Math.abs(tank.xv) > 0){
            tank.xv -= xv;
        }
        if(Math.abs(tank.yv) > 0){
            tank.yv -= yv;
        }
    }/*else if(tank.mag != 0){
        var xv = Math.cos(mang) * tank.mag;
        var yv = Math.sin(mang) * tank.mag;
        if(tank.xv > 0){
            tank.xv += xv;
        }else if (tank.xv < 0){
            tank.xv -= xv;
        }
        if(tank.yv > 0){
            tank.yv += yv;
        }if(tank.yv < 0){
            tank.yv -= yv;
        }
    }*/
    turnTank();
    setTimeout(gameTick, 1000/speed);//waits until next frame
}
function turnTank(){
    var nang = Math.atan2(mx-(tank.x+tank.width/2),my-(tank.y+tank.height/2)); //calc ang to mouse
    if (nang < 0){
        nang += 2*Math.PI;
    }//change range to 0, 2pi
    if (nang < 0){
        nang += 2*Math.PI;
    }
    nang = Math.abs((Math.PI*2.5) - nang); //align angle with canvas
    if(tank.ang != nang){
    if ((((Math.PI*2) + nang - tank.ang) % (Math.PI*2)) > Math.PI){
        // turn left
        tank.ang -= degToRad(turnSpeed);
        if(tank.ang < nang){
            tank.ang = nang;
        }
    }else{
        //turn right
        tank.ang += degToRad(turnSpeed);
        if(tank.ang > nang){
            tank.ang = nang;
        }
    }}
}
function drawTank(x,y,wide,tall){
    ctx.save();
    ctx.translate(x+wide/2,y+tall/2);
    ctx.rotate(tank.ang);
    ctx.translate(-x-wide/2,-y-tall/2);
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(x,y);
    ctx.lineTo(x+wide,y+tall/2);
    ctx.lineTo(x,y+tall);
    ctx.lineTo(x,y);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    if(moving == 1 || kMove){
        ctx.beginPath();
        ctx.lineCap = "square";
        ctx.lineJoin = "square";
        ctx.fillStyle = "#ff0000";
        ctx.moveTo(x-wide/10,y+2);
        ctx.lineTo(x-wide/2,y+tall/4);
        ctx.lineTo(x-wide/5,y+tall/2);
        ctx.lineTo(x-wide/2,y+3*tall/4);
        ctx.lineTo(x-wide/10,y-2+tall);
        ctx.lineTo(x-wide/10,y+2);
        ctx.fill();
    }
    ctx.restore();
}
function bulletMove(){//updates all bullets in array
    for(var i = 0; i< bullets.length; i++){
        bullets[i].x += bullets[i].xv;
        bullets[i].y += bullets[i].yv;
        ctx.beginPath();
        ctx.fillStyle = bCol;
        ctx.arc(bullets[i].x, bullets[i].y, bullets[i].size/2, 0, Math.PI*2, true);
        ctx.fill();
        if(bullets[i].x > width || bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].y > height || killPursuer(bullets[i])){
            bullets.splice(i,1);
            i--;
        }
    }
    ctx.fillStyle = "#000000";
}
function shoot(){
    for(var i = 0; i< tank.rate; i++){//fire a certain amount of bullets
        var ang = tank.ang;
        if(tank.rand == true){//set offset
            var off = tank.offset*Math.random() - tank.offset/2;
        }
        else{//set offset if not randomized
            var off = ((i+1/2)*(tank.offset/tank.rate))-tank.offset /2;
        }
        var xspeed = tank.soffset*Math.random() - tank.soffset/2;//calculate bullet speed
        var yspeed = tank.soffset*Math.random() - tank.soffset/2;
        off*= (Math.PI/180);
        ang += off;
        var xv = tank.mag*Math.cos(tank.ang);//calculate tank velocity
        var yv = tank.mag*Math.sin(tank.ang);
        var bxv = bullSped*Math.cos(ang)+xspeed + xv;//calculate bullet vector
        var byv = bullSped*Math.sin(ang)+yspeed + yv;
        var bullet = {//construct bullet object
            x: tank.x+tank.width/2,
            y: tank.y+tank.height/2,
            xv: bxv,
            yv: byv,
            ang: ang,
            size: bSize,
            damage: tank.damage
        };
        bullets.push(bullet);//add bullet to array of active bullets
    }
}
function reset(){//resets player upon death
    tank.x = width/2 - tank.width/2;
    tank.y = width/2 - tank.height/2;
    tank.mag = 0;
    tank.xv = 0;
    tank.yv = 0;
    bullets = [];
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
function pursRes(){//resets the enemy
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
    }if(pursuer.speed< 5){
        pursuer.speed*=1.05;
    }
    enemyHp *= 1.05;
    
}
function killPursuer(bullet){//damage enemy
    if(bullet.x+bSize/2 > pursuer.x  && bullet.x-bSize/2 < pursuer.x + pursuer.width && bullet.y+bSize/2 > pursuer.y && bullet.y-bSize/2 < pursuer.y + pursuer.width ){
        pursuer.hp -= bullet.damage;
        return true;
    }
    return false;
}
function pMove(){//enemy ai
    if(pursuer.hp <= 0){//reset enemy upon death
        pursRes();
        pursuer.hp = enemyHp;
        points++;
        score.innerText = "Score: " + points;
    }
    if(pursuer.x > tank.x && pursuer.y > tank.y &&  pursuer.x < tank.x + tank.width && pursuer.y < tank.y + tank.height){//kills player on contact with pursuer
        reset();
    }
    var vx = (tank.x + tank.width/2 - pursuer.width/2) - pursuer.x;//calculate vector to player
    var vy = (tank.y + tank.height/2 - pursuer.width/2) - pursuer.y;
    var ang = Math.atan2(vx,vy);//calculate angle to player
    while(ang<0){//keep angle positive
        ang+=2*Math.PI;
    }
    ang = Math.abs((Math.PI*2.55) - ang);
    pursuer.ang = ang;
    pursuer.xv = pursuer.speed*Math.cos(pursuer.ang);//move toward player
    pursuer.yv = pursuer.speed*Math.sin(pursuer.ang);
    pursuer.x += pursuer.xv;
    pursuer.y += pursuer.yv;
    ctx.fillStyle = "#ff0000";//draw enemy
    ctx.fillRect(pursuer.x,pursuer.y,pursuer.width, pursuer.height);
    ctx.fillStyle = "#000000";
}
function cMove(evt){
    var min = Math.min(window.innerWidth,window.innerHeight);
    mx = evt.offsetX*(canvas.width/min);
    my = evt.offsetY*(canvas.height/min);
}
function drawCross(){//draws cursor
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(mx-5,my+5,5,20);
    ctx.fillRect(mx-5,my-20,5,20);
    ctx.fillRect(mx-25,my,20,5);
    ctx.fillRect(mx,my,20,5);
}
function tMove(){
    var nang = Math.atan2(tank.xv,tank.yv); //calc ang of current velocity
    if (nang < 0){
        nang += 2*Math.PI;
    }//change range to 0, 2pi
    if (nang < 0){
        nang += 2*Math.PI;
    }
    var xv = Math.cos(tank.ang) * accel;
    var yv = Math.sin(tank.ang) * accel;
    
    if(tank.mag<maxSped){//don't move if speed is too high
        tank.xv += xv;
        tank.yv += yv;
    }
    var xv = Math.cos(tank.ang) * friction;
    var yv = Math.sin(tank.ang) * friction;
    tank.xv -= xv;//friction calculation
    tank.yv -= yv;
}
function changeGun(gun){
    switch(gun){
        case 1://machine gun
            tank.rate = 1;
            tank.damage = 30;
            tank.offset = 5;
            tank.soffset = 1;
            tank.cooldown = 0;
            tank.rand = false;
            bullSped = 10;
            bSize = 5;
            break;
        case 2://shotgun
            tank.rate = 50;
            tank.rand = true;
            tank.damage = 10;
            tank.offset = 30;
            tank.soffset = 1;
            tank.cooldown = 20;
            bullSped = 5;
            bSize = 5;
            break;
        case 3://railgun
            tank.rate = 1;
            tank.rand = false;
            tank.damage = 500;
            tank.offset = 0;
            tank.soffset = 0;
            tank.cooldown = 50;
            bullSped = 20;
            bSize = 20;
            break;
    }
}
function move(evt){
    if(evt.code == "KeyW"){
        kMove = true
        //move forward
    }
    if(evt.code == "KeyA"){
        //turn left
        tank.ang-=turnSpeed;
    }else if(evt.code == "KeyD"){
        //turn right
        tank.ang+=turnSpeed;
    }
    if(evt.code=="Space"){
        kShoot = true;
    }
    switch(evt.code){
        case "Digit1":
            changeGun(1);
            break;
        case "Digit2":
            changeGun(2);
            break;
        case "Digit3":
            changeGun(3);
            break;
    }
}function moveUp(evt){
    if(evt.code == "KeyW"){
        kMove = false;
        
    }if(evt.code=="Space"){
        kShoot = false;
    }
}
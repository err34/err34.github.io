var OFFSET = 0;
var BOARD = [
    ["n","n","n","n","n","n","n","n","n","n"],
    ["n","n","n","s","s","s","s","n","n","n"],
    ["n","n","s","s","s","s","s","s","n","n"],
    ["n","s","s","s","s","s","s","s","s","n"],
    ["n","s","s","s","s","s","s","s","s","n"],
    ["n","s","s","s","s","s","s","s","s","n"],
    ["n","s","s","s","s","s","s","s","s","n"],
    ["n","n","s","s","s","s","s","s","n","n"],
    ["n","n","n","s","s","s","s","n","n","n"],
    ["n","n","n","n","n","n","n","n","n","n"]];
const image = document.getElementById('source');
function draw() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        var height = canvas.height;
        var width = canvas.width;
        setInterval(move, 16);
    }
}
function move(){
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        var width = canvas.width;
        var height = canvas.height;
        for(var i = 0; i< 10; i++){
            for(var j = 0; j< 10; j++){
                if(BOARD[i][j] == "s"){
                    ctx.drawImage(source, (width/10) * j, ((height/10)*i)+OFFSET, (width/10), (height/10));
                    if(((height/10)*(i+1))+OFFSET > height-OFFSET){
                        ctx.drawImage(source,(width/10) * j, (((height/10)*i)+OFFSET)-height, (width/10), (height/10));
                        // draw top copy
                    }
                }
                else if(BOARD[i][j] == "n"){
                    ctx.drawImage(cry, (width/10) * j, ((height/10)*i)+OFFSET, (width/10), (height/10));
                    if(((height/10)*(i+1))+OFFSET > height-OFFSET){
                        ctx.drawImage(cry,(width/10) * j, (((height/10)*i)+OFFSET)-height, (width/10), (height/10));
                        // draw top copy
                    }
                }
            }
        }
        OFFSET = ((OFFSET+(height/100))%(height));
    }
}
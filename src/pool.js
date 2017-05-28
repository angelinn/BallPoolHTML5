function Ball(x, y) {
    this.x = x;
    this.y = y;

    this.r = 25;
    this.speed = 1;
    this.xunits = 0;
    this.yunits = 0;

    this.advance = function () {
        this.x += this.xunits;
        this.y += this.yunits;
    }

    this.updateCue = function() {
        this.update();
        if (shot) {
            this.updateUnits()

            if (this.speed > 0)
                this.speed -= 0.001
            else {
                shot = false;
                this.speed = 1
            }
        }
    }

    this.update = function () {
        if (this.x > theCanvas.width - 20 || this.x < 20) {
            this.angle = 180 - this.angle;
            this.updateUnits()
        }
        else if (this.y > theCanvas.height - 20 || this.y < 20) {
            this.angle = 360 - this.angle;
            this.updateUnits()
        }
    }

    this.collidesWith = function(x, y) {
        return x <= (this.x + this.r) && y <= (this.y + this.r)
    }

    this.updateUnits = function() {
        this.xunits = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        this.yunits = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
    }
}

var theCanvas = document.getElementById("canvas");
var context = theCanvas.getContext("2d");
var shooting = false;
var shot = false;
var lastMove = null;
var cue = new Ball(theCanvas.width / 2, theCanvas.height / 2);

var balls = [cue, new Ball(theCanvas.width / 4, theCanvas.height / 4)]

theCanvas.addEventListener('mousedown', function (event) {
    if (cue.collidesWith(event.x, event.y))
        shooting = true;
});

theCanvas.addEventListener('mouseup', function (event) {
    if (shooting) {
        var diffX = event.x - cue.x;
        var diffY = event.y - cue.y;

        var rad = Math.atan2(diffY, diffX)

        cue.angle = rad * (180 / Math.PI)
        shooting = false
        shot = true
    }
});
theCanvas.addEventListener('touchstart', function (event) {
    if (cue.collidesWith(event.touches[0].pageX, event.touches[0].pageY))
        shooting = true;
});
theCanvas.addEventListener('touchmove', function (event) {
    lastMove = event;
});
theCanvas.addEventListener('touchend', function (event) {
    if (shooting) {
        var diffX = lastMove.touches[0].pageX - cue.x;
        var diffY = lastMove.touches[0].pageY - cue.y;

        var rad = Math.atan2(diffY, diffX)
        cue.angle = rad * (180 / Math.PI)
        shooting = false
        shot = true
    }
});

function drawCanvas() {
    context.fillStyle = '#6fa';
    context.fillRect(0, 0, theCanvas.width, theCanvas.height);
    
    context.strokeStyle = '#663300';
    context.lineWidth = 15;
    context.strokeRect(1, 1, theCanvas.width - 2, theCanvas.height - 2);
}

function drawBalls() {
    context.fillStyle = "#FFF";
    context.beginPath();

    context.arc(cue.x, cue.y, 17, 0, Math.PI * 2, true); //радиус на топчето

    context.closePath();
    context.fill();

    context.fillStyle = "#F00"
    context.beginPath();

    for (var i = 1; i < balls.length; ++i)
        context.arc(balls[i].x, balls[i].y, 17, 0, Math.PI * 2, true);
        
    context.closePath();
    context.fill();
}

function drawScreen() {  // правоъгълното поле
    drawCanvas();

    for (var i = 0; i < balls.length; ++i)
        balls[i].advance();

    drawBalls();

    cue.updateCue();
    for (var i = 1; i < balls.length; ++i)
        balls[i].update();
}

(function () {
    setInterval(drawScreen, 3);
})();

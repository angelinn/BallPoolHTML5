var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var shot = false;

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
        if (this.x > CANVAS_WIDTH - 20 || this.x < 20) {
            this.angle = 180 - this.angle;
            this.updateUnits()
        }
        else if (this.y > CANVAS_HEIGHT - 20 || this.y < 20) {
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

function Engine() {
    var _self = this;
    
    this.theCanvas = document.getElementById("canvas");

    CANVAS_HEIGHT = this.theCanvas.height;
    CANVAS_WIDTH = this.theCanvas.width;

    this.context = this.theCanvas.getContext("2d");
    this.shooting = false;
    //this.shot = false;
    this.lastMove = null;
    this.cue = new Ball(this.theCanvas.width / 2, this.theCanvas.height / 2);
    this.balls = [this.cue, new Ball(this.theCanvas.width / 4, this.theCanvas.height / 4)]

    this.drawCanvas = function() {
        this.context.fillStyle = '#6fa';
        this.context.fillRect(0, 0, this.theCanvas.width, this.theCanvas.height);
        
        this.context.strokeStyle = '#663300';
        this.context.lineWidth = 15;
        this.context.strokeRect(1, 1, this.theCanvas.width - 2, this.theCanvas.height - 2);
    }

    this.tick = function() {
        this.drawCanvas();

        for (var i = 0; i < this.balls.length; ++i)
            this.balls[i].advance();

        this.drawBalls();

        this.cue.updateCue();
        for (var i = 1; i < this.balls.length; ++i)
            this.balls[i].update();
    }

    this.detectCollisions = function() {
        for (var i = 0; i < balls.length; ++i) {

        }
    }

    this.drawBalls = function() {
        this.context.fillStyle = "#FFF";
        this.context.beginPath();

        this.context.arc(this.cue.x, this.cue.y, 17, 0, Math.PI * 2, true); //радиус на топчето

        this.context.closePath();
        this.context.fill();

        this.context.fillStyle = "#F00"
        this.context.beginPath();

        for (var i = 1; i < this.balls.length; ++i)
            this.context.arc(this.balls[i].x, this.balls[i].y, 17, 0, Math.PI * 2, true);
            
        this.context.closePath();
        this.context.fill();
    }

    this.theCanvas.addEventListener('mousedown', function (event) {
        if (_self.cue.collidesWith(event.x, event.y))
            _self.shooting = true;
    });

    this.theCanvas.addEventListener('mouseup', function (event) {
        if (_self.shooting) {
            var diffX = event.x - _self.cue.x;
            var diffY = event.y - _self.cue.y;

            var rad = Math.atan2(diffY, diffX)

            _self.cue.angle = rad * (180 / Math.PI)
            _self.shooting = false
            shot = true
        }
    });
    this.theCanvas.addEventListener('touchstart', function (event) {
        if (_self.cue.collidesWith(event.touches[0].pageX, event.touches[0].pageY))
            _self.shooting = true;
    });
    this.theCanvas.addEventListener('touchmove', function (event) {
        _self.lastMove = event;
    });
    this.theCanvas.addEventListener('touchend', function (event) {
        if (_self.shooting) {
            var diffX = lastMove.touches[0].pageX - _self.cue.x;
            var diffY = lastMove.touches[0].pageY - _self.cue.y;

            var rad = Math.atan2(diffY, diffX)
            _self.cue.angle = rad * (180 / Math.PI)
            _self.shooting = false
            shot = true
        }
    });
}
(function () {
    var engine = new Engine();
    
    setInterval(function() {
        engine.tick()
    }, 3);
})();

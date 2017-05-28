var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var CUE_SPEED = 2;
var BALL_SPEED = 1;

function Ball(x, y, speed) {
    this.x = x;
    this.y = y;

    this.r = 25;
    this.speed = speed;
    this.defaultSpeed = speed;
    this.xunits = 0;
    this.yunits = 0;
    this.moving = false;

    this.advance = function () {
        this.x += this.xunits;
        this.y += this.yunits;
    }

    this.update = function () {
        if (this.moving) {
            this.updateUnits()

            this.speed -= 0.002
            if (this.speed <= 0) {
                this.moving = false;
                this.speed = this.defaultSpeed;
            }
        }
        if (this.x > CANVAS_WIDTH - 75 || this.x < 75) {
            this.speed -= 0.05;
            console.log('wall collision')
            console.log(this.speed)
            this.angle = 180 - this.angle;
            this.updateUnits()
        }
        else if (this.y > CANVAS_HEIGHT - 75 || this.y < 75) {
            this.speed -= 0.05;
            console.log('wall collision')
            console.log(this.speed)
            this.angle = 360 - this.angle;
            this.updateUnits()
        }
    }

    this.collidesWith = function(x, y, r) {
        return ((x - this.x) * (x - this.x) + (this.y - y) * (this.y - y) <= (this.r + r) * (this.r + r))
    }

    this.updateUnits = function() {
        this.xunits = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        this.yunits = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
    }
}

function Engine() {
    var _self = this;
    
    this.theCanvas = document.getElementById("canvas");
    this.theCanvas.width = window.innerWidth - 20;
    this.theCanvas.height = window.innerHeight - 20;

    CANVAS_HEIGHT = this.theCanvas.height;
    CANVAS_WIDTH = this.theCanvas.width;

    this.context = this.theCanvas.getContext("2d");
    this.shooting = false;
    this.lastMove = null;
    this.cue = new Ball(this.theCanvas.width / 2, this.theCanvas.height / 2, 2);
    this.balls = [this.cue,
        new Ball(this.theCanvas.width / 4, this.theCanvas.height / 4, 1),
        new Ball(this.theCanvas.width / 3, this.theCanvas.height / 3, 1),
        new Ball(this.theCanvas.width / 5, this.theCanvas.height / 7, 1),
        new Ball(250, 250, 1),
        new Ball(800, 900, 1)]

    this.drawCanvas = function() {
        this.context.fillStyle = '#0A6C03';
        this.context.fillRect(0, 0, this.theCanvas.width, this.theCanvas.height);
        
        this.context.strokeStyle = '#663300';
        this.context.lineWidth = 100;
        this.context.strokeRect(1, 1, this.theCanvas.width - 2, this.theCanvas.height - 2);
    }

    this.tick = function() {
        this.detectCollisions();
        this.drawCanvas();

        for (var i = 0; i < this.balls.length; ++i)
            this.balls[i].advance();

        this.drawBalls();

        for (var i = 0; i < this.balls.length; ++i)
            this.balls[i].update();
    }

    this.detectCollisions = function() {
        for (var i = 0; i < this.balls.length; ++i) {
            for (var j = i + 1; j < this.balls.length; ++j) {
                if (this.balls[i].collidesWith(this.balls[j].x, this.balls[j].y, this.balls[j].r)) {
                    console.log('COLLISON')
                    this.handleCollision(this.balls[i], this.balls[j]);
                }
            }
        }
    }

    this.handleCollision = function(one, other) {
        var midpointx = (one.x + other.x) / 2;
        var midpointy = (one.y + other.y) / 2;

        var onex  =  midpointx + one.r * (one.x - other.x) / 1;
        var oney = midpointy + one.r * (one.y - other.y) / 1;
        var otherx = midpointx + other.r * (other.x - one.x) / 1;
        var othery = midpointy + other.r * (other.y - one. y) / 1;

        var onerad = Math.atan2(oney, onex)

        one.angle = onerad * (180 / Math.PI)
        var otherrad = Math.atan2(othery, otherx);
        other.angle = otherrad * (180 / Math.PI)

            one.speed -= 0.05;
        other.speed -= 0.05;
        one.moving = true
        other.moving = true
    }

    this.drawBalls = function() {
        this.context.fillStyle = "#FFF";
        this.context.beginPath();

        this.context.arc(this.cue.x, this.cue.y, 30, 0, Math.PI * 2, true); //радиус на топчето

        this.context.closePath();
        this.context.fill();

        this.context.fillStyle = "#F00"

        for (var i = 1; i < this.balls.length; ++i) {
        this.context.beginPath();
            this.context.arc(this.balls[i].x, this.balls[i].y, 30, 0, Math.PI * 2, true);
                    this.context.closePath();
        this.context.fill();
        }
            

    }

    this.theCanvas.addEventListener('mousedown', function (event) {
        if (_self.cue.collidesWith(event.x, event.y, 25))
            _self.shooting = true;
    });

    this.theCanvas.addEventListener('mouseup', function (event) {
        if (_self.shooting) {
            var diffX = event.x - _self.cue.x;
            var diffY = event.y - _self.cue.y;

            var rad = Math.atan2(diffY, diffX)

            _self.cue.angle = rad * (180 / Math.PI)
            _self.shooting = false
            _self.cue.moving = true
        }
    });
    this.theCanvas.addEventListener('touchstart', function (event) {
        
        if (!_self.cue.collidesWith(event.touches[0].pageX, event.touches[0].pageY))
            _self.shooting = true;
    });
    this.theCanvas.addEventListener('touchmove', function (event) {
        event.preventDefault();
        _self.lastMove = event;
    });
    this.theCanvas.addEventListener('touchend', function (event) {
        if (_self.shooting) {
            var diffX = _self.lastMove.touches[0].pageX - _self.cue.x;
            var diffY = _self.lastMove.touches[0].pageY - _self.cue.y;

            var rad = Math.atan2(diffY, diffX)
            _self.cue.angle = rad * (180 / Math.PI)
            _self.shooting = false
            _self.cue.moving = true
        }
    });
}
(function () {
    var engine = new Engine();
    
    setInterval(function() {
        engine.tick()
    }, 3);
})();

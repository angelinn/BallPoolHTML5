(function() {
  var shooting = false;
  var shot = false;
  var lastMove = null;
  
   function  drawScreen () {  // правоъгълното поле
      context.fillStyle = '#6fa';
      context.fillRect(0, 0, theCanvas.width, theCanvas.height);
      //вътрешното поле 
      context.strokeStyle = '#000000';
      context.strokeRect(1,  1, theCanvas.width-2, theCanvas.height-2);
      //топчето      
      ball.x += xunits;
      ball.y += yunits;
      context.fillStyle = "#77e";  
      context.beginPath();
      context.arc(ball.x,ball.y,17,0,Math.PI*2,true); //радиус на топчето
      context.closePath();
      context.fill();

      if (ball.x > theCanvas.width || ball.x < 0 ) {
         ball.angle = 180 - ball.angle;
      } else if (ball.y > theCanvas.height || ball.y < 0) {
         ball.angle = 360 - ball.angle;
      }

      updateBall();

   }

   function updateBall() {
	  if (shot) {
      xunits = Math.cos(ball.angle) * speed;
      yunits = Math.sin(ball.angle)  * speed;
      shot = false;
	  }
   }

   theCanvas = document.getElementById("canvas");
   context = theCanvas.getContext("2d");
   
   var speed = 1; // непроменлива скорост
   var angle = 0; //началният му ъгъл
   var radians = 0;
   var xunits = 0;
   var yunits = 0;
   var ball = {x: theCanvas.width / 2, y: theCanvas.height / 2, r:  25};
   updateBall();

   setInterval(drawScreen, 3);
	theCanvas.addEventListener('mouseup', function (event) {
if (event.x <= (ball.x + ball.r) && event.y <= (ball.y + ball.r))
	 shooting = true;
    });
	theCanvas.addEventListener('mousedown', function (event) {
    if (shooting){
        var diffX = event.x - ball.x;
        var diffY = event.y - ball.y;

        var rad = Math.atan2(diffY, diffX)
        ball.angle = rad;
        shooting = false
        shot = true
	    }
    });	
    theCanvas.addEventListener('touchstart', function (event) {
if (event.touches[0].pageX <= (ball.x + ball.r) && event.touches[0].pageY <= (ball.y + ball.r))
	 shooting = true;
    });
    theCanvas.addEventListener('touchmove', function (event) {
        lastMove = event;
    });
	theCanvas.addEventListener('touchend', function (event) {
        console.log(lastMove)
            if (shooting){
        var diffX = lastMove.touches[0].pageX - ball.x;
        var diffY = lastMove.touches[0].pageY - ball.y;

        var rad = Math.atan2(diffY, diffX)
        ball.angle = rad;
        shooting = false
        shot = true
	    }
    });
})();
var w         = $( window ).width(),
h             = $( window ).height(),
canvas        = $( "#space" )[0],
canvasCtx     = canvas.getContext('2d'),
center        = new vector([w/2,h/2]);
canvas.width  = w
canvas.height = h

// Converts from game coordinates to absolute coordinates
function absToGame(abs_vec){
  game_vec = new vector([abs_vec.x-center.x, -abs_vec.y+center.y]);
  return(game_vec)
}

// Converts from absolute coordinates to game coordinates
function gameToAbs(game_vec){
  abs_vec = new vector([game_vec.x+center.x, -game_vec.y+center.y]);
  return(abs_vec)
}

// simple function to render a circle to the canvas
function renderCircle(p, r, c){
  // circle at position p with radius r and color c
  	p = gameToAbs(p)
	canvasCtx.beginPath();
	canvasCtx.arc(p.x, p.y,r, 0, 2 * Math.PI, false);
	canvasCtx.fillStyle = c;
	canvasCtx.fill();
}

function renderLine(v1, v2, c){
  // Draws line from v1 to v2 with color c
  v1 = gameToAbs(v1)
  v2 = gameToAbs(v2)
  canvasCtx.beginPath();
  canvasCtx.moveTo(v1.x,v1.y);
  canvasCtx.lineTo(v2.x,v2.y);
  canvasCtx.strokeStyle = c;
  canvasCtx.stroke();
}



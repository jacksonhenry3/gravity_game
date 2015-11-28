var w         = $( window ).width(),
h             = $( window ).height(),
canvas        = $( "#space" )[0],
canvasCtx     = canvas.getContext('2d'),
center        = new vector([w/2,h/2]);
canvas.width  = w
canvas.height = h

// simple function to render a circle to the canvas
function renderCircle(p, r, c){
  // circle at position p with radius r and color c
	canvasCtx.beginPath();
	canvasCtx.arc(p.x, p.y,r, 0, 2 * Math.PI, false);
	canvasCtx.fillStyle = c;
	canvasCtx.fill();
}

function renderLine(v1, v2, c){
  // Draws line from v1 to v2 with color c
  v1 = convert_rel_to_abs(v1)
  v2 = convert_rel_to_abs(v2)
  canvasCtx.beginPath();
  canvasCtx.moveTo(v1.x,v1.y);
  canvasCtx.lineTo(v2.x,v2.y);
  canvasCtx.fillStyle = c;
  canvasCtx.stroke();
}

// convert from screen coordinates to standard x,y coordinates with 0,0 in the center of the screen
function convert_abs_to_rel(abs_vec){
  rel_vec = new vector([abs_vec.x-center.x,-abs_vec.y+center.y]);
  return(rel_vec)
}

// convert from standard x,y coordinates with 0,0 at the center of the screen to screen coordinates
function convert_rel_to_abs(rel_vec){
  abs_vec = new vector([rel_vec.x+center.x,-rel_vec.y+center.y]);
  return(abs_vec)
}


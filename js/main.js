var w         = $( window ).width(),
h             = $( window ).height(),
canvas        = $( "#space" )[0],
canvasCtx     = canvas.getContext('2d'),
center        = new vector([w/2,h/2]);
canvas.width  = w
canvas.height = h


// simple function to render a circle to the canvas
function renderCircle(p,r,c){
  // circle at position p with radius r and color c
	canvasCtx.beginPath();
	canvasCtx.arc(p.x, p.y,r, 0, 2 * Math.PI, false);
	canvasCtx.fillStyle = c;
	canvasCtx.fill();
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

// initial position of mouse
absolute_mouse_position = new vector([w/2,h/2])
relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)

// gets the position of the mouse whenever it is moved
$( "html" ).mousemove(function( event ) {
  absolute_mouse_position.x = event.pageX
  absolute_mouse_position.y = event.pageY
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)
});

// Example movement schemes should go here
// =======================================================
function control_scheme(c, idx, arr){
  // c.p is the position of the dummy circles
  // c.v is the velocity of the dummy circles
  // c.r is the radius of each dummy circle
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme(c, idx, arr){
  // the relative mosue position controls acceleration
  a = relative_mouse_position.scale(-dt/4000.)
  c.v = c.v.add(a)
  c.p = c.p.add(c.v)
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme(c, idx, arr){
  // the relative mosue position controls velocity
  c.v = relative_mouse_position.scale(-dt/40.)
  c.p = c.p.add(c.v)
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

// make sure to put the one you are testing at the end or comment all the others
// ========================================================

// generate a list of positions and radii for the dummy circles
DummyCircles = []
for (var i = 0; i < 20; i++) {
  r = 10+Math.random()*30
  p = new vector([ (Math.random()*2-1)*w/2, (Math.random()*2-1)*h/2])
  DummyCircles.push({r:r,p:p,v:zeroVector(2)})
}

// this is a single step of the animation
function step()
{
  // clears the canvas for new visuals
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  dt = 1

  // This represents the player
  renderCircle(convert_rel_to_abs(zeroVector(2)),10,'red')

  // This is where
  DummyCircles.forEach(control_scheme)

  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

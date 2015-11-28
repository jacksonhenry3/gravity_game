require["./vector"]

var w         = $( window ).width(),
h             = $( window ).height(),
canvas        = $( "#space" )[0],
canvasCtx     = canvas.getContext('2d'),
center        = new vector([w/2,h/2]);
canvas.width  = w
canvas.height = h
dt = .25

// simple function to render a circle to the canvas
function renderCircle(p,r,c){
  // circle at position p with radius r and color c
	canvasCtx.beginPath();
	canvasCtx.arc(p.x, p.y,r, 0, 2 * Math.PI, false);
	canvasCtx.fillStyle = c;
	canvasCtx.fill();
}

function renderLine(v1,v2){
  v1 = convert_rel_to_abs(v1)
  v2 = convert_rel_to_abs(v2)
  canvasCtx.beginPath();
  canvasCtx.moveTo(v1.x,v1.y);
  canvasCtx.lineTo(v2.x,v2.y);
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

// initial position of mouse
relative_mouse_position = zeroVector(2)
mouse_velocity = zeroVector(2)

// gets the position of the mouse whenever it is moved
$( "html" ).mousemove(function( event ) {
  absolute_mouse_position = new vector([event.pageX,event.pageY])
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)

  // currently in pixels per sample time (sample time is variable but not much)
  mouse_velocity = convert_abs_to_rel(absolute_mouse_position).subtract(relative_mouse_position)
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)

});

function getForce(c, idx, arr){
  // add each contribution to the netForce
  d = c.p.magnitude()
  net_acceleration = net_acceleration.add(c.p.norm().scale(1000/Math.pow(d,2)))
}



// Example movement schemes should go here
// =======================================================

// mouse_velocity is the vector velocity of the mouse
// relative_mouse_position is the vector posi of the mouse

function control_scheme(c, idx, arr){
  // c.p is the position of the dummy circles
  // c.v is the velocity of the dummy circles
  // c.r is the radius of each dummy circle
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme(c, idx, arr){
  // the relative mouse position controls acceleration
  a = relative_mouse_position.scale(-dt/4000.)
  c.v = c.v.add(a)
  c.p = c.p.add(c.v)
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme(c, idx, arr){
  // the mouse velocity controls velocity
  c.v = c.v.add(mouse_velocity.scale(-1))
  c.p = c.p.add(c.v)
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme(c, idx, arr){
  // the mouse velocity controls velocity and masses fall towards you
  d = c.p.magnitude()
  a = c.p.norm().scale(10000/Math.pow(d,1.3))
  // console.log(a.vals)
  // relative_mouse_position.scale(-dt/40)
  c.v = c.v.subtract(a.scale(dt))
  // c.v = a.scale(-dt))
  c.p = c.p.add(c.v.scale(dt))
  c.p = c.p.add(relative_mouse_position.scale(-dt/40))
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme(c, idx, arr){
  // masses stay in fixed configuration but change your acceleration and relative mouse position corrosponds to acceleration
  a   = net_acceleration.scale(10)
  a   = a.add(relative_mouse_position.scale(dt/150.))

  c.v = c.v.subtract(a.scale(dt))
  oscillator.frequency.value = c.v.magnitude()*20;
  if (colors == 1)
  {
    gainNode.gain.value = .1;
    
    $('#space').css('background',"hsl("+Math.atan2(c.v.y,c.v.x)/(2*Math.PI)*360+","+2*c.v.magnitude()+"%,10%)")

      }
  else  
  {
  gainNode.gain.value =0;
  }
  
  c.p = c.p.add(c.v.scale(dt))
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}






// make sure to put the one you are testing at the end or comment all the others
// ========================================================

// generate a list of positions and radii for the dummy circles
DummyCircles = []
for (var i = 0; i < 5; i++) {
  r = 10+Math.random()*30
  p = new vector([ (Math.random()*2-1)*w/2, (Math.random()*2-1)*h/2])
  DummyCircles.push({r:r,p:p,v:zeroVector(2)})
}
colors = -1

$(window).keypress(function (e) {
  if (e.keyCode === 0 || e.keyCode === 32) {
    e.preventDefault()
    colors=colors*-1
  }
})

// this is a single step of the animation
function step()
{
  // clears the canvas for new visuals
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  // this is the net gravitational acceleration from all masses
  net_acceleration = zeroVector()
  DummyCircles.forEach(getForce)


  // this shows the acceleration due to the masses
  // the direction and scaled magnitude of mouse input
  // and the net acceleration
  renderLine(zeroVector(),relative_mouse_position.scale(dt/150.).scale(100))
  renderLine(zeroVector(),net_acceleration.scale(10).scale(100))
  renderLine(zeroVector(),relative_mouse_position.scale(dt/150.).scale(100).add(net_acceleration.scale(10).scale(100)))

  // This represents the player
  renderCircle(convert_rel_to_abs(zeroVector(2)),10,'red')



  // This is where
  DummyCircles.forEach(control_scheme)



  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

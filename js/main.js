// Physical choices
dt = .25
circleColor = "white"

// initial position of mouse
relative_mouse_position = zeroVector(2)
mouse_velocity = zeroVector(2)

// Defines the player's properties
player = {
  vel: zeroVector(2),
  accel: zeroVector(2),
  radius: 10,
  color: 'red'
}

// gets the position of the mouse whenever it is moved
$( "html" ).mousemove(function( event ) {
  absolute_mouse_position = new vector([event.pageX,event.pageY])
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)

  // currently in pixels per sample time (sample time is variable but not much)
  mouse_velocity = convert_abs_to_rel(absolute_mouse_position).subtract(relative_mouse_position)
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)

});

function getCircleForce(c){
  // Returns the force exerted by a circle on the player
  d = c.p.magnitude()
  return c.p.norm().scale(1000/Math.pow(d,2))
}

// Example mouse forces below

function getMouseForce1(){
  return relative_mouse_position.scale(dt/150.)
}

function getMouseForce2(){
  return 0
}

getMouseForce = getMouseForce1


// Example movement schemes should go here
// =======================================================

// mouse_velocity is the vector velocity of the mouse
// relative_mouse_position is the vector posi of the mouse

function control_scheme1(c){
  // c.p is the position of the dummy circles
  // c.v is the velocity of the dummy circles
  // c.r is the radius of each dummy circle
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme2(c){
  // the relative mouse position controls acceleration
  a = relative_mouse_position.scale(-dt/4000.)
  c.v = c.v.add(a)
  c.p = c.p.add(c.v)
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme3(c){
  // the mouse velocity controls velocity
  c.v = c.v.add(mouse_velocity.scale(-1))
  c.p = c.p.add(c.v)
  renderCircle(convert_rel_to_abs(c.p),c.r,'white')
}

function control_scheme4(c){
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

function control_scheme5(c){
  // masses stay in fixed configuration but change your acceleration and relative mouse position corrosponds to acceleration
  a = player.accel.scale(10)  
  c.v = c.v.subtract(a.scale(dt))
  c.p = c.p.add(c.v.scale(dt))
}

// Choice of control scheme
control_scheme = control_scheme5

function updateColorAndSound() {
  // Controls sound and color
  oscillator.frequency.value = player.vel.magnitude()*20;
  if (colors == 1)
  {
    gainNode.gain.value = .1;
    $('#space').css('background',"hsl("+Math.atan2(player.vel.y, player.vel.x)/(2*Math.PI)*360+","+2*player.vel.magnitude()+"%,10%)")
  }
  else  
  {
    gainNode.gain.value =0;
  }
}

function renderGameCircle(c) {
  renderCircle(convert_rel_to_abs(c.p), c.r, circleColor)
}

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
    
    // TEST
    console.log("colors = "+colors)
  }
})

// this is a single step of the animation
function step()
{
  // clears the canvas for new visuals
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  // this is the net gravitational acceleration from all masses
  player.accel = zeroVector()
  for(var i=0; i<DummyCircles.length; i++) {
    player.accel = player.accel.add(getCircleForce(DummyCircles[i]))
  }
  player.accel = player.accel.add(getMouseForce())
  
  player.vel = player.vel.add(player.accel)
  
  // This represents the player
  renderCircle(convert_rel_to_abs(zeroVector(2)), player.radius, player.color)

  // this shows the acceleration due to the masses
  // the direction and scaled magnitude of mouse input
  // and the net acceleration
  renderLine(zeroVector(), relative_mouse_position.scale(dt/150.).scale(100))
  renderLine(zeroVector(), player.accel.scale(10).scale(100))
  renderLine(zeroVector(), relative_mouse_position.scale(dt/150.).scale(100).add(player.accel.scale(10).scale(100)))
  
  // Controls movement
  DummyCircles.forEach(control_scheme)
  
  // Renders all circles
  DummyCircles.forEach(renderGameCircle)
  
  // Handles colors and sounds
  updateColorAndSound()

  

  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

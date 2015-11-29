// Sets up the game

physicsStepTime = 25

// Controls sound and color
function updateColorAndSound() {
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

// Generates a list of positions and radii for the dummy circles
planets = []
for (var i = 0; i < 5; i++) {
  r = 10+Math.random()*30
  p = new vector([ (Math.random()*2-1)*w/2, (Math.random()*2-1)*h/2])
  planets.push(new planet(p, r))
}
colors = -1

// Registers space to toggle colors
function registerColorAndSoundToggle() {
  $(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) {
      e.preventDefault()
      colors=colors*-1
    }
  })
}
registerColorAndSoundToggle()

// Records mouse events to the mouse object
function registerMouseEvents() {
  $( "html" ).mousemove(function( event ) {
    // Records the previous relative mouse position 
    prevRelPos = mouse.relPos
    
    // Determines new positions
    mouse.absPos = new vector([event.pageX,event.pageY])
    mouse.relPos = absToGame(mouse.absPos)

    // Calculates velocity. Unit: Pixels / sample time
    mouse.vel = mouse.relPos.subtract(prevRelPos)
  });
}
registerMouseEvents()

// A single step of the physics
function physicsStep()
{
  // Controls the player's motion
  controlScheme(player, planets, mouse)
  
  // Deals with collisions
  collisionPlanet = detectCollision(player, planets)
  if(collisionPlanet) {
    resolveCollision(player, collisionPlanet)
  }
}
setInterval(physicsStep, 25);

// A single step of the animation
function renderStep()
{
  // Clears the canvas for new visuals
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
  player.render()
  for(var i=0; i<planets.length; i++) {
    planets[i].render()
  }
  
  // Lines demonstrating mouse accel (white), net accel (yellow), and current velocity (green)
  mouseAccel = mouse.relPos.scale(dt/150.).scale(1000.)
  netAccel = player.accel.scale(1000)
  currVel = player.vel.scale(15)
  renderLine(zeroVector(), mouseAccel, "white")
  renderLine(zeroVector(), netAccel, "yellow")
  renderLine(zeroVector(), currVel, "green")
  
  // Handles colors and sounds
  updateColorAndSound()

  window.requestAnimationFrame(renderStep);
}
window.requestAnimationFrame(renderStep);

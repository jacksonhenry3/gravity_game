// Sets up the game

physicsStepTime = 25

// -- Enables sound and color interactivity --

// Sets the background color
function setBgColor(color) {
    $('#space').css('background',color)
}

// All necessary code for setting sound and color to zero
function disableSoundAndColor() {
  gainNode.gain.value = 0
  setBgColor("black")
}

// Control schemes for sound and color here

function updateColor1(player1) {
  setBgColor("hsl("+Math.atan2(player1.vel.y, player1.vel.x)/(2*Math.PI)*360+","+2*player1.vel.magnitude()+"%,10%)")
}

function updateSound1(player1) {
  oscillator.frequency.value = player1.vel.magnitude()*20;  
  gainNode.gain.value = .1;
}

function updateSound2(player1) {
  oscillator.frequency.value = 100 + player.vel.magnitude()/2.;
  gainNode.gain.value = player1.vel.magnitude() * 1/1000.;
}


// Choose color and sound control scheme here
updateSound = updateSound2
updateColor = updateColor1

function updateColorAndSound(player1) {
  if(colors == 1) {
    updateColor(player1)
    updateSound(player1)
  } else {
    disableSoundAndColor()
  }
}
colors = -1

// -- Creates world objects --

// Creates the player
player = new playerObject()

// Generates a list of dummy planets
planets = []
for (var i = 0; i < 5; i++) {
  r = 10+Math.random()*30
  p = new vector([ (Math.random()*2-1)*w/2, (Math.random()*2-1)*h/2])
  planets.push(new planet(p, r))
}

// -- Registers key events --

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

// -- Begins game --

// A single step of the physics
physicsStep = function() {
  updateWorld(player, planets, mouse)
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
  mouseAccel = mouse.relPos.limit(mouseMax).scale(1.)
  netAccel = player.accel.scale(300.)
  currVel = player.vel.scale(10.)
  drawLine(zeroVector(), mouseAccel, "white")
  drawLine(zeroVector(), netAccel, "yellow")
  drawLine(zeroVector(), currVel, "green")
  
  // Handles colors and sounds
  updateColorAndSound(player)

  window.requestAnimationFrame(renderStep);
}
window.requestAnimationFrame(renderStep);

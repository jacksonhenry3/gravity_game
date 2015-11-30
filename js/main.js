// Sets up the game

physicsStepTime = 25

// -- Enables sound and color interactivity --

// Sets the background color
function setBgColor(color) {
    $('#space').css('background',color)
}

// Control schemes for sound and color here

function updateColor1(player1) {
  // Changes the background color based on the player's velocity
  h = Math.atan2(player1.vel.y, player1.vel.x)/(2*Math.PI)*360
  s = 2*player1.vel.magnitude()
  l = 10
  setBgColor(hsl(h,s,l))
}

updateColor2Data = {
  initialized: false,
  colorRatio: 0.,
}
function updateColor2(player1) {
  // Changes the background color on collision
  // Smoothely returns it to the normal color over time
  
  // Color choices
  normal = {r:0, g:0, b:0}
  collision = {r:0, g:50, b:0}
  
  // Amount of color change per tick
  ratioDrop = 0.05
  
  // Adds a callback function to change background color on collision
  // Only adds this function if updateColor2 is running for the first time
  if(!updateColor2Data.initialized) {
    function changeBgOnCollision(planet1) {
      // Changes the color ratio to 1
      updateColor2Data.colorRatio = 1
    }
    runOnCollision(changeBgOnCollision)
    
    updateColor2Data.initialized = true
  }
  
  // Determines and sets the color
  currRatio = updateColor2Data.colorRatio
  currColor = {
    r: Math.round(smoothScale(normal.r, collision.r, currRatio)),
    g: Math.round(smoothScale(normal.g, collision.g, currRatio)),
    b: Math.round(smoothScale(normal.b, collision.b, currRatio))
  }
  setBgColor(rgb(currColor.r, currColor.g, currColor.b))
  
  // Updates the current ratio
  newRatio = updateColor2Data.colorRatio - ratioDrop
  updateColor2Data.colorRatio = Math.max(newRatio, 0)
}

function updateSound1(player1) {
  oscillator.frequency.value = player1.vel.magnitude()*20;  
  gainNode.gain.value = .1;
}

function updateSound2(player1) {
  oscillator.frequency.value = 100 + player.vel.magnitude()/2.;
  gainNode.gain.value = Math.min(player1.vel.magnitude() * 1/1000., 0.02);
}


updateSound3Data = {
  initialized: false,
  midiNote: 0.
}
function updateSound3(player1) {
  // Changes frequency on collision
  gainNode.gain.value = Math.min(player1.vel.magnitude() * 1/1000., 0.02);
  
  // Adds a callback function to change frequency on collision
  // Only adds this function if updateSound3 is running for the first time
  if(!updateSound3Data.initialized) {
    function changeSoundOnCollision(planet1) {
      updateSound3Data.midiNote = Math.random() * 24
    }
    runOnCollision(changeSoundOnCollision)
    
    updateSound3Data.initialized = true
  }
  
  // Calculates and sets the frequency
  freq = midiToFreq(updateSound3Data.midiNote + 30)
  oscillator.frequency.value = freq;
}

// Choose color and sound control scheme here
updateColor = updateColor2
updateSound = updateSound3

// All necessary code for setting sound and color to zero
function disableSoundAndColor() {
  gainNode.gain.value = 0
  setBgColor("black")
  
  updateColor2Data.colorRatio = 0
}

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
  m = Math.pow(r,2) / 400.
  c = "white"
  planets.push(new planet(p, r, m, c))
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

// Registers reset
function registerReset() {
  $(window).keypress(function (e) {
    if (e.keyCode === 114) {
      e.preventDefault()
      player.pos = zeroVector(2)
      player.vel = zeroVector(2)
    }
  })
}
registerReset()


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

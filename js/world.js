// Runs the game world

// Arbitrary constants
dt = .25
gravity = 1000

// Defines mouse properties
mouse = {
  absPos: zeroVector(2),
  relPos: zeroVector(2),
  vel: zeroVector(2)
}

// Defines player properties
player = {
  pos: zeroVector(2),
  vel: zeroVector(2),
  accel: zeroVector(2),
  color: "red",
  radius: 10,
  render: function() {
    renderCircle(this.pos, this.radius, this.color)
  }
}

// Defines planet object
function planet(pos, radius, color) {
  this.pos = pos
  this.radius = radius
  
  // If no color is specified, defaults to white
  this.color = (color || "white")
  
  this.getForce = function(dVector) {
    // Calculates inverse square force
    d = dVector.magnitude()
    forceMag = gravity / (d*d)
    return dVector.norm().scale(forceMag)
  }
  
  this.render = function() {
    renderCircle(this.pos, this.radius, this.color)
  }

}

// Control schemes here
// A control scheme specifies:
// 1) What do planets do to the player?
// 2) What does the mouse do to the player?
// 3) Do we change the player's position or the planets'?

function controlScheme1(player1, planets1, mouse1) {
  // Planet positions accelerate the player
  // Mouse position accelerates the player
  // Planets move
  
  player1.accel = zeroVector(2)
  
  // Adds planet accel
  function addPlanetForce(p) {
    player1.accel = player1.accel.add(p.getForce(p.pos))
  }
  planets1.forEach(addPlanetForce)
  
  // Adds mouse accel
  mouseForceScale = 1/150.
  player1.accel = player1.accel.add(mouse.relPos.scale(dt * mouseForceScale))
  
  // Updates player velocity
  player1.vel = player1.vel.add(player1.accel)
  
  // Updates planet positions
  function updatePlanetPosition(p) {
    p.pos = p.pos.subtract(player1.vel)
  }
  planets1.forEach(updatePlanetPosition)
}

// Set the control scheme here
controlScheme = controlScheme1


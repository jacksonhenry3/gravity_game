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
  rel: function(v) {
    // Returns the position of v relative to the player
    return v.subtract(this.pos)
  },
  render: function() {
    renderCircle(zeroVector(2), this.radius, this.color)
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
    renderCircle(player.rel(this.pos), this.radius, this.color)
  }
}

// Control schemes here
// A control scheme specifies:
// 1) What do planets do to the player?
// 2) What does the mouse do to the player?
// 3) Whose position changes? (Player? Planets?)

function controlScheme1(player1, planets1, mouse1) {
  // Planet positions accelerate the player
  // Mouse position accelerates the player
  // Player moves
  
  player1.accel = zeroVector(2)
  
  // Adds planet accel
  function addPlanetForce(p) {
    player1.accel = player1.accel.add(p.getForce(player.rel(p.pos)))
  }
  planets1.forEach(addPlanetForce)
  
  // Adds mouse accel
  mouseForceScale = 1/150.
  player1.accel = player1.accel.add(mouse.relPos.scale(dt * mouseForceScale))
  
  // Updates player velocity
  player1.vel = player1.vel.add(player1.accel)
  
  // Updates player position
  player1.pos = player1.pos.add(player1.vel)
}

// Set the control scheme here
controlScheme = controlScheme1


// Collision handling

// // Returns the planet colliding with player if one exists, else returns false
// function detectCollision(player1, planets1) {
//   for(var i=0; i<planets1.length; i++) {
//     currPlanet = planets1[i]
    
//     distVector = player1.pos.subtract(currPlanet.pos)
//     dist = distVector.magnitude()
//     collisionDist = player1.radius + currPlanet.radius
//     if(dist < collisionDist) {
//       // Collision detected. Returns the colliding planet
//       return currPlanet
//     }
//   }
//   // No planet found
//   return false
// }

// // Resolves a collision between player1 and planet1
// function resolveCollision(player1, planet1) {
//   distVector = player.pos.subtract(planet1.pos)
//   if(distVector < )
// }
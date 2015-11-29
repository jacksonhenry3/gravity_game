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
function playerObject() {
  this.pos = zeroVector(2)
  this.vel = zeroVector(2)
  this.accel = zeroVector(2)
  this.color = "red"
  this.radius = 10
  
  // Returns the relative position of v to the player
  this.rel = function(v) {
    return v.subtract(this.pos)
  }
  
  // Resets the player for a new physics step
  this.reset = function() {
    this.accel = zeroVector(2)
  }
  
  // Changes velocity and position
  this.update = function() {
    // TODD: Should dt be an argument?
    
    // Updates player velocity
    this.vel = this.vel.add(this.accel)
    
    // Updates player position
    this.pos = this.pos.add(this.vel)
  }
  
  // Draws the player
  this.render = function() {
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

function applyGravity(player1, planets1) {
  player1.accel = zeroVector(2)
  
  // Adds planet accel
  function addPlanetForce(p) {
    player1.accel = player1.accel.add(p.getForce(player.rel(p.pos)))
  }
  planets1.forEach(addPlanetForce)
}

// -- Control schemes here --
// A control scheme specifies what the mouse does to the player

function controlScheme1(player1, mouse1) {
  // Mouse position accelerates the player
  mouseForceScale = 1/150.
  player1.accel = player1.accel.add(mouse.relPos.scale(dt * mouseForceScale))
}

// -- Set the control scheme here --
controlScheme = controlScheme1


// Collision handling

// Returns the planet colliding with player if one exists, else returns false
function detectCollision(player1, planets1) {
  for(var i=0; i<planets1.length; i++) {
    currPlanet = planets1[i]
    
    distVector = player1.pos.subtract(currPlanet.pos)
    dist = distVector.magnitude()
    collisionDist = player1.radius + currPlanet.radius
    if(dist < collisionDist) {
      // Collision detected. Returns the colliding planet
      return currPlanet
    }
  }
  // No planet found
  return false
}

// Resolves a collision between player1 and planet1
function resolveCollision(player1, planet1) {
  distVector = player1.pos.subtract(planet1.pos)
  
  // Translates player out of planet
  requiredDist = planet1.radius + player1.radius
  mtv = distVector.norm().scale(requiredDist).subtract(distVector)
  player1.pos = player1.pos.add(mtv)
  
  // Changes the velocity (if the player is traveling into the planet)
  velDirection = player1.vel.dot(distVector)
  if(velDirection < 0) {
    // Calculates the parallel component of the player's velocity and reverses it
    parallelVel = player1.vel.project(distVector)
    player1.vel = player1.vel.subtract(parallelVel.scale(2))
  }
}

// A single step of physics in the world
function updateWorld(player1, planets1, mouse1) {
  // Updates the player's acceleration
  player1.reset()
  applyGravity(player1, planets1)
  controlScheme(player1, mouse1)
  
  // Deals with collisions
  collisionPlanet = detectCollision(player1, planets1)
  if(collisionPlanet) {
    resolveCollision(player1, collisionPlanet)
  }
  
  // Updates the player
  player1.update()
}
var Driver = require('driver'),
     State = require('state'),
     Rules = require('rules');

var Tank = function(id, name, x, y, bodyHeading, gunHeading, energy) {
  var self = this;
  
  self.id                 = id;
  self.name               = name;
  self.x                  = x;
  self.y                  = y;
  self.bodyHeading        = bodyHeading;
  self.gunHeading         = gunHeading;
  self.velocity           = 0;
  self.energy             = energy;
  self.state              = State.active;
  self.boundingBox        = null;
  
  // Activity status
  self.bodyTurnRemaining  = 0;
  self.gunTurnRemaining   = 0;
  self.distanceRemaining  = 0;
  self.firePower          = 0;
  
  // Driving logic
  self.driver = new Driver(self);
  
  // -- public
  
  // Returns current shared state
  self.sharedState = function() {
    return {
      id:           self.id,
      name:         self.name,
      x:            self.x, 
      y:            self.y,
      bodyHeading:  self.bodyHeading,
      gunHeading:   self.gunHeading,
      energy:       self.energy,
      state:        self.state
    };
  }
  
  // Turns the body
  self.turnBody = function(deg) {
    self.bodyHeading = (self.bodyHeading + deg) % 360;
  }
  
  // Turns the gun
  self.turnGun = function(deg) {
    self.gunHeading = (self.gunHeading + deg) % 360;
  }

  self.coordsForMove = function(distance) {
    var heading = self.bodyHeading * Math.PI / 180;
    return { x: self.x + distance * Math.sin(heading),
             y: self.y - distance * Math.cos(heading) };
  }
  
  // Moves the tank and updates the bounding box
  self.move = function(distance) {
    var c = self.coordsForMove(distance);
    self.placeAt(c.x, c.y);
  }
  
  // Places the tank at a given location
  // (used when there's a need to put a tank to the safe coords initially or
  //  after a collision)
  self.placeAt = function(x, y) {
    self.x = x;
    self.y = y;
    updateBoundingBox();
  }

  // Adds or takes the energy. If energy's gone, the tank is dead
  self.changeEnergy = function(delta) {
    self.energy += delta;

    if (self.energy <= 0) {
      self.energy = 0;
      self.state = State.dead;
    }
  }
  
  // Returns TRUE if the state of the tank is 'dead'
  self.isDead = function() {
    return self.state == State.dead;
  }
  
  // -- commands
  
  self.setMove = function(distance) {
    self.distanceRemaining = distance;
  }
  
  self.setBodyTurn = function(deg) {
    self.bodyTurnRemaining = deg % 360;
  }
  
  self.setGunTurn = function(deg) {
    self.gunTurnRemaining = deg % 360;
  }
  
  self.fire = function(power) {
    self.firePower = Math.min(Math.max(Rules.minBulletPower, power), Rules.maxBulletPower);
  }
  
  // -- private
  
  function updateBoundingBox() {
    self.boundingBox = {
      x: self.x - Rules.tankWidth / 2 + 2,
      y: self.y - Rules.tankHeight / 2 + 2,
      w: Rules.tankWidth - 4,
      h: Rules.tankHeight - 4 };
  }
  
  // -- init

  updateBoundingBox();
}

module.exports = Tank;

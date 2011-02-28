var Rules = require('rules');

// Encapsulates all driving logic with respect to the Rules
var Driver = function(tank) {
  var self = this;
  
  self.tank = tank;
  
  // Chooses the right velocity to cover the distance remaining
  self.updateVelocity = function() {
    var dr = self.tank.distanceRemaining;
    var sign = dr >= 0 ? 1 : -1;
    self.tank.velocity = self.tank.isDead() ? 0 : sign * Math.min(Math.abs(dr), Rules.maxVelocity);
  }
  
  // Makes the move and updates the state
  // Returns the distance covered
  self.move = function() {
    self.updateVelocity();

    var dt = 0;
    var dr = self.tank.distanceRemaining;
    var v  = self.tank.velocity;

    if (v != 0) {
      // Velocity reflects the distance we'll cover during this tick
      // Later, when we have acceleration / deceleration, we won't be able to
      // stop momentarily if someone says to stop now. It will take some time.
      // #updateVelocity will take care of accel / decel for us and we continue
      // to use #velocity as the distance to travel.
      dt = v;
      self.tank.move(dt);

      // This will cause the tank to move back to the target point after the
      // abrupt changing of the distance remaining that leads to missing the point
      // due to inability to stop immediately.
      // 
      // If it's necessary to just stop without pedalling back to the exact location,
      // we can keep the distanceRemaining at 0 until decelerated to 0.
      //
      // NOTE: It applies only to when we have accel / decel logic.
      self.tank.setMove(dr - dt);
    }

    return dt;
  }
  
  // Turns the body
  self.turnBody = function() {
    var angle = self.tank.bodyTurnRemaining;
    if (self.tank.isDead() || angle == 0) return;
    
    var turnRate = Rules.turnRate(self.tank.velocity);
    
    // If we need to turn more than we can at the moment,
    // turn to whatever angle we can and leave the rest to the following ticks
    if (Math.abs(angle) > turnRate) angle = angle > 0 ? turnRate : -turnRate;
    
    self.tank.turnBody(angle);
    self.tank.turnGun(angle); // When we turn the body, the gun turns with it
    self.tank.setBodyTurn(self.tank.bodyTurnRemaining - angle);
  }
  
  // Turns the gun
  self.turnGun = function() {
    var angle = self.tank.gunTurnRemaining;
    if (self.tank.isDead() || angle == 0) return;
    
    var turnRate = Rules.gunTurnRate;
    
    // If we need to turn more than we can at the moment,
    // turn to whatever angle we can and leave the rest to the following ticks
    if (Math.abs(angle) > turnRate) angle = angle > 0 ? turnRate : -turnRate;
    
    self.tank.turnGun(angle);
    self.tank.setGunTurn(self.tank.gunTurnRemaining - angle);
  }
}

module.exports = Driver;

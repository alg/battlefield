function Tank(id) {
  var self = this;

  PIx2 = Math.PI * 2;
  SPEED = 4;
  
  // current status
  self.status = {
    id:           id,
    x:            0,
    y:            0,
    angle:        0,
    turretAngle:  0,
    speed:        0,
    energy:       100,
    dead:         false
  };
  
  // Flag to show that the tank has to fire during the next game tick
  self.fired = false;
  
  // moving status
  var mvForward = 1, mvBackward = -1, mvStop = 0;
  var move = mvStop;
  
  // turning status
  var tnCCW = 2 * PIx2 / 360.0, tnCW = -tnCCW, tnStop = 0;
  var turn = tnStop, turnTurret = tnStop;

  function reduceEnergy(v) {
    if (!v) v = 1;
    self.status.energy -= v;
    var ok = self.status.energy > 0;
    
    if (!ok) die();
    
    return ok;
  }

  function die() {
    self.status.dead = true;
    console.log(self.name, 'died');
  }
  
  this.hitByBullet = function() {
    console.log('Hit')
    reduceEnergy(2);
  }
  
  this.setPosition = function(x, y, angle) {
    self.status.x = x;
    self.status.y = y;
    self.status.angle = angle;
    console.log(x, y, angle);
  }
  
  this.setTurnTurret = function(tn) {
    turnTurret = tn >= 1 ? tnCCW : tn <= -1 ? tnCW : tnStop;
  }
  
  this.setTurn = function(tn) {
    turn = tn >= 1 ? tnCCW : tn <= -1 ? tnCW : tnStop;
  }
  
  this.setMove = function(mv) {
    move = mv >= 1 ? mvForward : mv <= -1 ? mvBackward : mvStop;
  }
  
  this.fire = function() {
    if (reduceEnergy()) self.fired = true;
  }

  this.hasFired = function() {
    var f = self.fired;
    self.fired = false;
    return f;
  }
  
  this.tick = function(w, h) {
    if (self.status.dead) return;
    if (turn != tnStop) self.status.angle = (self.status.angle + turn) % PIx2;
    if (turnTurret != tnStop) self.status.turretAngle = (self.status.turretAngle + turnTurret) % PIx2;
    if (move != mvStop) {
      self.status.x += move * SPEED * Math.cos(self.status.angle);
      self.status.y += move * SPEED * Math.sin(self.status.angle);
    }
    
    return self.status;
  }
}

module.exports = Tank;

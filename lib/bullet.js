var sys = require('sys'),
  Rules = require('rules');

function Bullet(tank, power) {
  var self  = this;
  var s     = tank.sharedState();
  var src   = tank;

  self.id       = Bullet.seq++;
  self.x        = s.x;
  self.y        = s.y;
  self.heading  = s.gunHeading;
  self.velocity = Rules.bulletSpeed(power);
  self.power    = power;

  var h  =  self.heading * Math.PI / 180;
  var dx =  self.velocity * Math.sin(h),
      dy = -self.velocity * Math.cos(h);
  
  
  self.sharedState = function() {
    return {
      id:       self.id,
      x:        self.x,
      y:        self.y,
      heading:  self.heading,
      velocity: self.velocity
    }
  }

  self.sourceTank = function() {
    return src;
  }
  
  self.move = function() {
    self.x += dx;
    self.y += dy;
  }
}

Bullet.seq = 0;

module.exports = Bullet;
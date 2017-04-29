var sys = require('sys');
var Rules = require('rules');

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
  var dx =  self.velocity * Math.sin(h);
  var dy = -self.velocity * Math.cos(h);


  self.sharedState = () => ({
    id:       self.id,
    x:        self.x,
    y:        self.y,
    heading:  self.heading,
    velocity: self.velocity
  })

  self.sourceTank = () => src

  self.move = () => {
    self.x += dx;
    self.y += dy;
  }
}

Bullet.seq = 0;

module.exports = Bullet;
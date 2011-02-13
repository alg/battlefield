var sys = require('sys');

function Bullet(tank) {
  var self = this;
  var s = tank.status;
  
  self.status = {
    id: String(s.id) + '-' + String(s.energy),
    source: tank,
    x: s.x,
    y: s.y,
    angle: s.angle,
    hit: false
  }

  var SPEED = 6;
  var dx = SPEED * Math.cos(self.status.angle),
      dy = SPEED * Math.sin(self.status.angle);
  
  this.tick = function() {
    self.status.x += dx;
    self.status.y += dy;
    return self.status;
  };
}

module.exports = Bullet;
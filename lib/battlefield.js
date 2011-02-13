var Bullet = require('bullet'),
    Collider = require('collider');

function Battlefield(width, height) {
  var self = this;

  // configuration
  self.width              = width;
  self.height             = height;

  // status
  self.tanks              = [];
  self.currentTanksStatus = [];
  self.bullets            = [];
  self.bulletsStatus      = [];
  
  var collider = new Collider(52, 72);
  
  var usedPlacement = [];
  var cellW = cellH = 100;
  var placementCellsX = width / cellW - 2;
  var placementCellsY = height / cellH - 2;
  
  this.addTank = function(tank) {
    var found = false;
    var x = y = c = null;

    // Find a random spot
    while (!found) {
      x = Math.round(Math.random() * placementCellsX);
      y = Math.round(Math.random() * placementCellsY);
      c = y * placementCellsX + x;
      if (!usedPlacement[c]) {
        usedPlacement[c] = true;
        found = true;
      }
    }

    tank.setPosition((x + 1) * cellW, (y + 1) * cellH, Math.random() * 2 * Math.PI);
    self.tanks.push(tank);
    
    self.currentTanksStatus.push(tank.status);
  }
  
  this.tick = function() {
    self.currentBulletsStatus = tickBullets();
    self.currentTanksStatus   = tickTanks();
    
    // collision detection
  }
  
  function tickTanks() {
    var st = [];
    for (var i = self.tanks.length - 1; i >= 0; i--) {
      var tank = self.tanks[i];
      if (tank.hasFired()) self.bullets.push(new Bullet(tank));
      st.push(tank.tick());
    }
    return st;
  }
  
  function tickBullets() {
    var st = [];
    for (var i = self.bullets.length - 1; i >= 0; i--){
      var bullet = self.bullets[i];
      var s = bullet.tick();
      if (s.x < 0 || s.x > self.width || s.y < 0 || s.y > self.height) {
        self.bullets.splice(i, 1);
      } else {
        for (var n = self.tanks.length - 1; n >= 0; n--){
          var t = self.tanks[n];
          if (t != bullet.status.source) {
            var ts = t.status;
            if (collider.collides(ts.x, ts.y, s.angle, s.x, s.y)) {
              s.hit = t;
              t.hitByBullet();
              self.bullets.splice(i, 1)
              break;
            }
          }
        };
        st.push(s);
      }
    }
    return st;
  }
}

module.exports = Battlefield;

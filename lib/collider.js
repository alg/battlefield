var sys = require('sys');

function Collider(tankWidth, tankHeight) {
  var w = tankWidth / 2, h = tankHeight / 2;
  var r = Math.sqrt(w * w + h * h);
  
  this.collides = function(tx, ty, ta, x, y) {
    var dx = Math.abs(tx - x);
    var dy = Math.abs(ty - y);
    var d  = Math.sqrt(dx * dx + dy * dy);
    
    if (d > r) {
      return false;
    } else {
      // potential collision
      // TODO determine precisely
      return true;
    }
  }
}

module.exports = Collider;
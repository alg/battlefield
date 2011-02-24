// Detects collision between the set of rectangualr objects and the moving one.
// The moving one can be in the set.
// Objects are expected to have properties #x, #y and #angle.
// All objects are assumed to have the same dimensions defined by Collider instance settings.
var Collider = function(settings) {
  
  var objectWidth   = settings.objectWidth || 30;
  var objectHeight  = settings.objectHeight || 40;
  var objectReach   = Math.sqrt(objectHeight * objectHeight / 4 + objectWidth * objectWidth / 4);

  // Validates the move and returns the hash with two fields:
  // collisions - (boolean) true when collision occured
  // distance   - (float) distance travelled (total or before the collision)
  this.validateMove = function(objects, target) {
    var collisions  = [];
    var info        = { collisions: collisions, distance: target.speed };
    
    if (target.speed != 0) {
      objects = findCloseObjects(objects, target);
      objects = findInTheDirectionOfMove(objects, target);
      info    = findCollisions(objects, target);
    }
    
    return info;
  }
  
  // Returns the objects that are within reach
  function findCloseObjects(objects, target) {
    return objects;
  }
  
  // Returns the objects that are in the direction of move
  function findInTheDirectionOfMove(objects, target) {
    return objects;
  }
  
  // Returns objects that were hit by the move and the minimum distance traveled
  function findCollisions(objects, target) {
    var minDistance = target.speed;
    var collisions  = [];
    
    
    
    return { collisions: collisions, distance: minDistance };
  }
  
  // Offsets and turns the set of objects, so that the #target is in the center
  // and facing top.
  // Returns the same objects but with new properties #c_x and #c_y
  function translate(objects, target) {
    var dx = target.x, dy = target.y, ang = -target.angle;
    
    for (var i = objects.length - 1; i >= 0; i--){
      var o = objects[i];
      var nx = o.x - dx;
      var ny = o.y - dy;
      
      var c = Math.cos(ang), s = Math.sin(ang);
      o.c_x = nx * c - ny * s;
      o.c_y = ny * c + nx * s;
    };
    
    return objects;
  }
}
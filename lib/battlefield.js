var CollisionChecker = require('collision_checker'),
           Placement = require('placement'),
                Tank = require('tank'),
                 sys = require('sys'),
               Rules = require('rules'),
               Event = require('event');

var Battlefield = function(battlefieldWidth, battlefieldHeight) {
  var self = this;
  
  var tanks   = []; // All tanks on the field
  var bullets = []; // All bullets on the field
  var events  = []; // In each tick we collect events to be broadcast

  var collisionChecker = new CollisionChecker(battlefieldWidth, battlefieldHeight);
  var placement = new Placement(battlefieldWidth, battlefieldHeight, 100, 100);
  
  // Adds a tank to the battle field at a vacant cell
  this.addTank = function(id, name) {
    var tank = null;
    var cell = placement.reserveCell();
    if (cell) {
      var angle = 0; //Math.random() * 360;
      tank = new Tank(id, name, cell.x, cell.y, angle, 0, 100);
      tanks.push(tank);
    }

    return tank;
  }
  
  // Called when the client disconnects before the game is started
  this.removeTank = function(tank) {
  }
  
  // Called when the client disconnects during the game
  this.haltTank = function(tank) {
  }

  // One tick of the game -- fires bullets, moves tanks, turns guns
  // and returns the shared state.
  this.tick = function() {
    clearEvents();
    
    moveBullets();
    fireBullets();
    moveTanks();
    turnTanks();
    turnGuns();

    return self.sharedState();
  }
  
  self.sharedState = function() {
    var tankStates = [], bulletStates = [];
    
    for (var i in tanks)   tankStates.push(tanks[i].sharedState());
    for (var i in bullets) bulletStates.push(bullets[i].sharedState());
    
    return {
      tanks:    tankStates,
      bullets:  bulletStates,
      events:   events
    }
  }
  

  // -- private
  
  function clearEvents() {
    events = [];
  }
  
  function fireBullets() {
  }
  
  function moveBullets() {
  }
  
  function moveTanks() {
    eachTank(function(tank) {
      var distance = tank.driver.move();
      if (distance == 0) return;

      var collision = collisionChecker.checkWallCollision(tank);
      if (collision) {
        // Hit the wall
        tank.changeEnergy(-Rules.wallHitDamage(tank.velocity));

        sys.log('Hit wall: ' + sys.inspect(collision) + ' energy=' + tank.energy);
        addEvent(Event.hitWall, { tank: tank.id });
      } else {
        collision = collisionChecker.checkTankCollision(tank, tanks, distance);
        if (collision) {
          // Hit another tank
          var otherTank = collision.tank;
        
          tank.changeEnergy(-Rules.robotHitDamage);
          otherTank.changeEnergy(-Rules.robotHitDamage);
        
          addEvent(Event.hitTank, { tank: tank.id, otherTank: otherTank.id });
          sys.log('Hit tank: ' + sys.inspect(collision) + ' energy=' + tank.energy);
        }
      }
    
      // If there was a collision -- move to the safe coordinates
      if (collision) {
        tank.placeAt(collision.x, collision.y);
        tank.velocity = 0;
        tank.setMove(0);
      }
    });
  }
  
  function turnTanks() {
    eachTank(function(tank) { tank.driver.turnBody(); });
  }
  
  function turnGuns() {
    eachTank(function(tank) { tank.driver.turnGun(); });
  }
  
  function addEvent(name, data) {
    if (typeof data == 'undefined') data = {};
    data['name'] = name;
    
    events.push(data);
  }
  
  function eachTank(cb) {
    for (var i in tanks) cb(tanks[i]);
  }
};

module.exports = Battlefield;
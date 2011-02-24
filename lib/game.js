var Battlefield = require('battlefield'),
    Tank        = require('tank'),
    sys         = require('sys');

function Game(server) {
  var self = this;
  
  self.settings = {
    battlefield: {
      width: 1000,
      height: 500
    },
    tank: {
      width: 40,
      height: 30
    },
    physics: {
      tank_speed: 4,
      bullet_speed: 6,
      tank_turn_angle: 2,       // degrees
      tank_turret_turn_angle: 2 // degrees
    }
  }
  
  self.server = server;
  self.battlefield = new Battlefield(self.settings.battlefield.width, self.settings.battlefield.height);
  self.active = false;

  this.start = function() {
    if (self.active) return;

    sys.log('GAME: Started');

    self.active = true;
    broadcast('game_started');
    scheduleNextTick();
  }
  
  this.tick = function() {
    self.battlefield.tick();
    var status = currentStatus();
    broadcast('status', status);

    if (ended(status.tanks)) {
      self.active = false;
      broadcast('game_ended');
    } else {
      scheduleNextTick();
    }
  }
  
  function currentStatus() {
    return {
      tanks: self.battlefield.currentTanksStatus,
      bullets: self.battlefield.currentBulletsStatus
    }
  }

  function scheduleNextTick() {
    setTimeout(function() { self.tick(); }, 30);
  }

  function broadcast(type, data) {
    server.broadcast(JSON.stringify({ type: type, data: data }));
  }

  function ended(status) {
    for (var i = status.length - 1; i >= 0; i--){
      if (status[i] && !status[i].dead) return false;
    };
    return true;
  }

  server.addListener('connection', function(conn) {
    sys.log('CONNECT: ' + conn.id);
    
    // report the battlefield data
    conn.send(JSON.stringify({
      type: 'init',
      data: {
        battlefield:  self.settings.battlefield,
        tank:         self.settings.tank
      }
    }));

    conn.send(JSON.stringify({
      type: 'status',
      data: currentStatus()
    }));
    
    var tank = null;
    
    conn.addListener('message', function(message) {
      var json = JSON.parse(message);
      
      if (json.type == 'join') {
        // add tank and broadcast
        tank = new Tank(conn.id);
        self.battlefield.addTank(tank);

        self.server.broadcast(JSON.stringify({
          type: 'join',
          data: tank.status
        }));
      } else if (json.type == 'start') {
        self.start();
      } else {
        // ignore data if the game is not active
        if (!self.active) return;

        // relay commands to the tank
        if (json.move != null) tank.setMove(parseInt(json.move));
        if (json.turn != null) tank.setTurn(parseInt(json.turn));
        if (json.turnTurret != null) tank.setTurnTurret(parseInt(json.turnTurret));
        if (json.fire) tank.fire();
      }
    });
  });
}

module.exports = Game;
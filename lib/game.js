var Battlefield = require('battlefield'),
           Tank = require('tank'),
            sys = require('sys'),
          State = require('state'),
          Rules = require('rules');

function Game(server) {
  var self = this;
  
  self.settings = {
    battlefield: {
      width:  1000,
      height: 500 },
    tank: {
      width:  Rules.tankWidth,
      height: Rules.tankHeight }
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
    var status = self.battlefield.tick();
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

  function ended(tank_statuses) {
    for (var i in tank_statuses) {
      if (tank_statuses[i].state != State.dead) return false;
    }
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
      data: self.battlefield.sharedState()
    }));
    
    var tank = null;
    
    conn.addListener('message', function(message) {
      var json = JSON.parse(message);
      
      if (json.type == 'join') {
        // add tank and broadcast
        tank = self.battlefield.addTank(conn.id, json.name || 'Unnamed');

        if (!tank) {
          sys.log('Failed to join: ' + conn.id + ' name: ' + json.name);
        } else {
          self.server.broadcast(JSON.stringify({
            type: 'join',
            data: tank.sharedState()
          }));
        }
      } else if (json.type == 'start') {
        self.start();
      } else {
        // ignore data if the game is not active
        if (!self.active) return;

        // relay commands to the tank
        if (json.move != null) tank.setMove(parseInt(json.move));
        if (json.turn != null) tank.setBodyTurn(parseInt(json.turn));
        if (json.turnGun != null) tank.setGunTurn(parseInt(json.turnGun));
        if (json.fire != null) tank.fire(parseFloat(json.fire));
      }
    });
  });
}

module.exports = Game;
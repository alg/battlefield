function Tank(field, status) {
  var self = this;

  self.field = $(field);
  self.body = null;
  
  this.setStatus = status => {
    self.status = status;
    update();
  }
  
  function update() {
    if (!self.body) {
      self.head = $("<div class='head'>");
      self.body = $("<div class='tank'>").append(self.head);
      self.field.append(self.body);
    } else {
      var s = self.status;
      var x = s.x;
      var y = s.y;
      var a = 'rotate(' + s.bodyHeading + 'deg)';
      var ga = 'rotate(' + (s.gunHeading - s.bodyHeading) + 'deg)';

      self.body.css('top', String(y) + 'px')
        .css('left', String(x) + 'px')
        .css('-webkit-transform', a)
        .css('-moz-transform', a)
        .css('transform', a);

      self.head
        .css('-webkit-transform', ga)
        .css('-moz-transform', ga)
        .css('transform', ga);
    }
  }
  
  this.setStatus(status);
  update();
}

function Bullet(field) {
  var self = this;

  self.field = $(field);
  self.body = null;
  
  this.setStatus = status => {
    self.status = status;
    update();
  }

  this.remove = () => {
    self.body.remove();
  }

  function update() {
    var s = self.status;
    var x = s.x;
    var y = s.y;

    self.body.css('top', String(y) + 'px')
      .css('left', String(x) + 'px');
  }
  
  self.body = $("<div class='bullet'>");
  self.field.append(self.body);
}

function Battlefield(id, link) {
  var self = this;

  self.bf = $(id);
  self.tanks = {};
  self.bullets = {};

  link.addConnectListener(() => { console.log('Battlefield connected'); });
  link.addMessageListener(json => {
    if (json.type == 'init') {
      self.bf.width(json.data.battlefield.width).height(json.data.battlefield.height);
    } else if (json.type == 'status') {
      var status = json.data;

      var tanksStatus = status.tanks;
      for (var i = tanksStatus.length - 1; i >= 0; i--) {
        var t = tanksStatus[i];
        var tank = self.tanks[t.id];
        if (!tank) {
          tank = new Tank(self.bf, t);
          self.tanks[t.id] = tank;
        } else {
          tank.setStatus(t);
        }
      }

      var bulletsStatus = status.bullets || [];
      var seenBullets = [];
      for (var i = bulletsStatus.length - 1; i >= 0; i--) {
        var b = bulletsStatus[i];
        var bullet = self.bullets[b.id];
        if (!bullet) {
          bullet = new Bullet(self.bf);
          self.bullets[b.id] = bullet;
        }
        
        seenBullets[b.id] = true;
        bullet.setStatus(b);
      }
      
      // remove gone bullets
      for (var id in self.bullets) {
        if (!seenBullets[id]) {
          var bullet = self.bullets[id];
          delete self.bullets[id];
          bullet.remove();
        }
      }
    } else if (json.type == 'join') {
      var t = json.data;
      tank = new Tank(self.bf, t);
      self.tanks[t.id] = tank;
    }
  });
}

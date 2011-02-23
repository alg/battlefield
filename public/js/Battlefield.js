window.Battlefield = atom.Class({
	initialize: function (element, link) {
		this.libcanvas = new LibCanvas(element, {
			preloadImages: {
				ship: '/images/ship-red.png'
			}
		}).start();

		link
		.addEvent('connect', this.connect.context(this))
		.addEvent('message', this.message.context(this));
	},
	connect: function () {
		atom.log('Battlefield connected');
	},
	message: function (json) {
		this.actions[json.type].call(this, json);
	},

	// units
	units: {},
	addUnit: function (unit) {
		this.units[unit.id] = unit;
		this.libcanvas.addElement(unit);
		return this;
	},
	updateUnit: function (data) {
		if (this.units[data.id]) {
			this.units[data.id].setStatus(data);
		} else {
			this.addUnit(new Unit(data));
		}
		return true;
	},
	rmUnit: function (unit) {
		delete this.units[unit.id];
		this.libcanvas.rmElement(unit);
		return this;
	},

	// actions
	actions: {
		init: function (json) {
			this.libcanvas.set({
				width : json.data.battlefield.width,
				height: json.data.battlefield.height
			});
		},
		status: function (json) {
			var status = json.data;

			status.tanks.forEach(this.updateUnit.context(this));

			// var bullets = status.bullets || [];
		},
		join: function (json) {
			this.updateUnit(json.data);
		}
	}

});

/*
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
*/
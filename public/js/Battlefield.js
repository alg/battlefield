window.Battlefield = atom.Class({
	initialize: function (element, link) {
		this.libcanvas = new LibCanvas(element, {
			fps: 20,
			preloadImages: {
				enemy : '/images/ship-red.png',
				player: '/images/ship-blue.png',
				shot  : '/images/shot.png',
				explosion: '/images/explosion.png',
			},
			preloadAudio: {
				explosion : '/sounds/explosion.*',
			}
		})
		.addEvent('ready', function () {
			this.getAudio('explosion').gatling(10);
		})
		.start();

		link
		.addEvent('connect', this.connect.context(this))
		.addEvent('message', this.message.context(this));
	},
	connect: function () {
		atom.log('Battlefield connected');
	},
	message: function (json) {
		if (json.type in this.actions) {
			this.actions[json.type].call(this, json);
		} else {
			//throw new TypeError('No action «' + json.type + '» in Battlefield');
			atom.log('No action «' + json.type + '» in Battlefield');
		}
	},

	// astract
	addElement: function (element, hash) {
		this[hash][element.id] = element;
		this.libcanvas.addElement(element);
		return this;
	},
	updateElement: function (data, hash, Class) {
		if (this[hash][data.id]) {
			this[hash][data.id].setStatus(data);
		} else {
			this.addUnit(new Class(data));
		}
		return this;
	},
	rmElement: function (element, hash) {
		delete this[hash][element.id];
		element.die();
		return this;
	},
	updateElementsSet: function (data, hash, suffix) {
		var alive = {}, i;

		for (i = data.length; i--;) if (data[i]) {
			this['update' + suffix](data[i]);
			alive[data[i].id] = true;
		}

		for (i in this[hash]) if (!alive[i]) {
			this['rm' + suffix](this[hash][i]);
		}

		return this;
	},

	// units
	units: {},
	addUnit: function (unit) {
		return this.addElement(unit, 'units');
	},
	updateUnit: function (data) {
		return this.updateElement(data, 'units', Unit);
	},
	rmUnit: function (unit) {
		return this.rmElement(unit, 'units');
	},
	updateUnitsSet: function (units) {
		return this.updateElementsSet(units, 'units', 'Unit');
	},

	// bullets
	bullets: {},
	addBullet: function (bullet) {
		return this.addElement(bullet, 'bullets');
	},
	updateBullet: function (data) {
		return this.updateElement(data, 'bullets', Bullet);
	},
	rmBullet: function (bullet) {
		return this.rmElement(bullet, 'bullets');
	},
	updateBulletsSet: function (bullets) {
		return this.updateElementsSet(bullets, 'bullets', 'Bullet');
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

			this.updateUnitsSet  (status.tanks   || []);
			this.updateBulletsSet(status.bullets || []);
		},
		join: function (json) {
			json.data.isPlayer = true;
			this.updateUnit(json.data);
		}
	}

});
window.Unit = atom.Class({
	Implements: [Drawable],

	position: new Point(0, 0),


	energyShift: {x: 0, y: -30},
	energyRectWidth: 50,
	energyRectHeight: 4,

	initialize: function (status) {
		this.isPlayer = status.isPlayer;
		this.setStatus(status);

		this.addEvent('libcanvasReady', function () {
			this.setZIndex(50);

			var image = this.libcanvas.getImage(this.isPlayer ? 'player' : 'enemy');

			this.animation = new Animation()
				.addSprites(image, 60)
				.run({
					line : Array.range(0,8),
					delay: 40,
					loop : true
				});
		});
	},

	get id () {
		return this.status.id;
	},

	setStatus: function (status) {
		this.status = status;
		this.position.set(status.x, status.y);
		this.libcanvas && this.libcanvas.update();
	},

	die: function () {
		this.libcanvas.rmElement(this);
		this.libcanvas.addElement(new Explosion(this.position));
		return this;
	},

	get energyColor() {
		var energy = this.status.energy;

		return energy > 75 ? ['#090', '#030']:
		       energy > 50 ? ['#0f0', '#090']:
		       energy > 25 ? ['#ff0', '#990']:
		                     ['#f00', '#900'];
	},

	_energyRect: null,
	_energySprite: null,
	get energySprite() {
		var unit   = this,
		    rect   = unit._energyRect,
			width  = unit.energyRectWidth,
			height = unit.energyRectHeight,
			sprite = unit._energySprite,
			energy = unit.status.energy;
		if (!rect) {
			rect = unit._energyRect = new Rectangle({
				from:  new Point(0.5, 0.5),
				size: [width-1, height-1]
			});
			rect.toMax = function () {
				rect.width = width-1;
				return rect;
			};
			rect.toEnergy = function () {
				rect.width = (width-1) * unit.status.energy / 100;
				return rect;
			};
		}
		if (!sprite) {
			sprite = unit._energySprite = LibCanvas.Buffer(width, height, true);
		}
		if (sprite.energy != energy) {
			var color = this.energyColor;
			sprite.ctx
				.clearAll()
				.fill(rect.toEnergy(), color[0])
				.stroke(rect.toMax() , color[1])
			sprite.energy = energy;
		}
		return sprite;
	},

	draw: function () {
		this.libcanvas.ctx
			.drawImage({
				image : this.animation.getSprite(),
				center: this.position,
				angle : this.status.angle + (90).degree()
			})
			.drawImage({
				image: this.energySprite,
				center: this.position.clone().move(this.energyShift)
			});
	}
});
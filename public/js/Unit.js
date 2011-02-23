window.Unit = atom.Class({
	Implements: [Drawable],

	position: new Point(0, 0),

	maxEnergyRectWidth: 50,

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

	get energyRect() {
		var maxWidth = this.maxEnergyRectWidth;
		var rect = new Rectangle({
			from: this.position.clone().move({ x: -maxWidth/2+.5, y : 25.5 }),
			size: {
				width: this.status.energy / 100 * maxWidth,
				height: 5
			}
		});
		rect.maxWidth = maxWidth;
		rect.energy   = this.status.energy;
		return rect;
	},

	draw: function () {
		var color = this.energyColor, energy = this.energyRect;
		this.libcanvas.ctx
			.drawImage({
				image : this.animation.getSprite(),
				center: this.position,
				angle : this.status.angle + (90).degree()
			})
			.fill(energy, color[0]);

		energy.width = energy.maxWidth;

		this.libcanvas.ctx.stroke(energy, color[1]);
	}
});
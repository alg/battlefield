window.Bullet = atom.Class({
	Implements: [Drawable],
	
	position: new Point(0, 0),
	
	initialize: function (status) {
		this.setStatus(status);
		this.setZIndex(100);

		this.addEvent('libcanvasSet', function () {
			//this.libcanvas.getAudio('shot').playNext();
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
		return this;
	},

	draw : function () {
		this.libcanvas.ctx.fill(
			new Circle(this.position, 3), 'red'
		);
	}
});
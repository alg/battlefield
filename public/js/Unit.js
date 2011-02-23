window.Unit = atom.Class({
	Implements: [Drawable],

	initialize: function (status) {
		this.addEvent('libcanvasReady', function () {
			this.setStatus(status);
		});
	},

	setStatus: function (status) {
		this.status = status;
		this.libcanvas.update();
	},

	draw: function () {
		this.libcanvas.ctx.fill(
			new Circle(this.status.x, this.status.y, 20),
			'royalblue'
		);
	}
});
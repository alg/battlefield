window.App = atom.Class({
	link: null,

	initialize: function (link) {
		this.link = link
			.addEvent('connect', function () {
				atom.log('App connected');
				link.send('join');
			})
			.addEvent('message', function(json) {
				atom.log('App link message', json);
			})
	},

	command: function (data) {
		this.link.send(null, data);
		return this;
	},

	go: function () {
		this.link.send('start');
		return this;
	},

	initBattlefield: function (element) {
		new Battlefield(element, this.link);
		return this;
	},

	start: function () {
		this.link.connect();
		return this;
	}
});

atom(function() {
	window.app = new App(new Link())
		.initBattlefield('#battlefield canvas')
		.start();
});

LibCanvas.extract();
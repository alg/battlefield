window.ManualControl = atom.Class({
	app: null,

	command: { move: 0, turn: 0, fire: 0 },

	initialize: function (app) {
		this.app = app;
		
		var control = this,
			kb = LibCanvas.Keyboard;

		atom(document).bind({
			keydown: function (e) {
				switch (kb.key(e)) {
					case 'aup'   : control.moveForwards(); break;
					case 'adown' : control.moveBack();     break;
					case 'aleft' : control.turnLeft();     break;
					case 'aright': control.turnRight();    break;
					case 'space' : control.fire();         break;
				}
			}.context(this),
			keyup: function (e) {
				switch (kb.key(e)) {
					case 'aup'   :
					case 'adown' :
						control.stopMove();
						break;
					case 'aleft' :
					case 'aright':
						control.stopTurn();
						break;
				}
			}.context(this),
		})
	},

	send: function () {
		this.app.command(this.command);
		return this;
	},

	// accessors
	get move () {
		return this.command.move;
	},
	set move (val) {
		this.command.move = val;
	},

	get turn () {
		return this.command.turn;
	},
	set turn (val) {
		this.command.turn = val;
	},

	// moving
	moveForwards: function () {
		this.move = this.move < 0 ? 0 : 1;
		return this.send();
	},
	moveBack: function () {
		this.move = this.move > 0 ? 0 : -1;
		return this.send();
	},
	stopMove: function () {
		this.move = 0;
		return this.send();
	},

	// rotating
	turnLeft: function () {
		this.turn = this.turn > 0 ? 0 : -1;
		return this.send();
	},
	turnRight: function () {
		this.turn = this.turn < 0 ? 0 : 1;
		return this.send();
	},
	stopTurn: function () {
		this.turn = 0;
		return this.send();
	},

	// fire
	fire: function () {
		this.app.command({ fire: 1 });
		return this;
	}
});
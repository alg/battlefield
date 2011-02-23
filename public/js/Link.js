window.Link = atom.Class({
	Implements: [atom.Class.Events],

	socket: null,

	connect: function() {
		var socket = new WebSocket('ws://localhost:8000/');

		socket.onopen = function() {
			this.fireEvent('connect');
		}.context(this);

		socket.onmessage = function(message) {
			this.fireEvent('message', [JSON.parse(message.data)]);
		}.context(this);

		this.socket = socket;
	},

	send: function(type, data) {
		if (!this.socket) {
			throw new TypeError('Socket is not connected');
		}
		this.socket.send(JSON.stringify(type ? { type: type, data: data } : data));
	}
});
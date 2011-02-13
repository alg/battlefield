function Link() {
  var self = this;
  var socket;
  var messageListeners = [];
  var connectListeners = [];
  
  this.addConnectListener = function(l) {
    connectListeners.push(l);
  }
  
  this.addMessageListener = function(l) {
    messageListeners.push(l);
  }
  
  this.connect = function() {
    socket = new WebSocket('ws://localhost:8000/');
    socket.onopen = function() {
      notify(connectListeners);

      socket.onmessage = function(message) {
        notify(messageListeners, JSON.parse(message.data));
      }
    }
  }
  
  this.send = function(type, data) {
    socket.send(JSON.stringify(type ? { type: type, data: data } : data));
  }
  
  function notify(listeners) {
    for (var i = 0; i < listeners.length; i++) {
      var l = listeners[i];
      l.apply(this, Array().slice.call(arguments, 1));
    };
  }
}
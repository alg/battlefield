function Link() {
  var self = this;
  var socket;
  var messageListeners = [];
  var connectListeners = [];
  
  this.addConnectListener = l => {
    connectListeners.push(l);
  }
  
  this.addMessageListener = l => {
    messageListeners.push(l);
  }
  
  this.connect = () => {
    socket = new WebSocket('ws://localhost:8000/');
    socket.onopen = () => {
      notify(connectListeners);

      socket.onmessage = message => {
        notify(messageListeners, JSON.parse(message.data));
      }
    }
  }
  
  this.send = (type, data) => {
    socket.send(JSON.stringify(type ? { type, data } : data));
  }
  
  function notify(listeners) {
    for (var i = 0; i < listeners.length; i++) {
      var l = listeners[i];
      l.apply(this, Array().slice.call(arguments, 1));
    };
  }
}


function App(link) {
  var self = this;

  link.addConnectListener(function() {
    console.log('App connected');
    link.send('join');
  })

  link.addMessageListener(function(json) {
    //console.log(json.type, json.data);
  })
    
  this.command = function(data) {
    link.send(null, data);
  }
}

function go() {
  link.send('start');
}

var app, link;
$(function() {
  link = new Link();
  app  = new App(link);
  bf   = new Battlefield('#battlefield', link);
  link.connect();
//  setInterval(app.fireEvent, 1000);
});

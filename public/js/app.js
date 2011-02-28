function App(link) {
  var self = this;

  link.addConnectListener(function() {
    console.log('App connected');
    link.send('join', { name: 'Sample' });
    link.send('start');
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

function move(distance) {
  app.command({ move: distance });
}

function turnLeft(deg) {
  app.command({ turn: -deg });
}

function turnRight(deg) {
  app.command({ turn: deg });
}

function turnGunLeft(deg) {
  app.command({ turnGun: -deg });
}

function turnGunRight(deg) {
  app.command({ turnGun: deg });
}

function fire(power) {
  app.command({ fire: power });
}

var app, link;
$(function() {
  link = new Link();
  app  = new App(link);
  bf   = new Battlefield('#battlefield', link);
  link.connect();
//  setInterval(app.fireEvent, 1000);
});

var http       = require('http');
var sys        = require('sys');
var nodeStatic = require('node-static/lib/node-static');
var ws         = require('node-websocket-server/lib/ws/server');
var Game       = require('game');
var url        = require('url');

function Tanks(options) {
  var self = this;
  
  self.settings = {
    port: options.port || 8000
  }
  
  function init() {
    self.httpServer = createHTTPServer();
    self.httpServer.listen(self.settings.port);
    sys.log('Server is on ' + self.settings.port);
    
    self.server = ws.createServer({
      server: self.httpServer
    });
    
    self.server.addListener("listening", () => {
      sys.log("Listening...");
    });
    
    self.game = new Game(self.server);
  }
  
  function createHTTPServer() {
    return http.createServer((req, res) => {
      var file = new nodeStatic.Server('./public', { cache: false });
      
      req.addListener("end", () => {
        var loc = url.parse(req.url, true);
        
        if (loc.pathname == '/start') {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('OK');
          self.game.start();
        } else {
          file.serve(req, res);
        }
      });
    });
  }
  
  function createBayeuxServer() {
    return new faye.NodeAdapter({
      mount: '/faye',
      timeout: 45
    });
  }
  
  init();
}

module.exports = Tanks;
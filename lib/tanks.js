var http       = require('http'),
    sys        = require('sys'),
    nodeStatic = require('node-static/lib/node-static'),
    ws         = require('node-websocket-server/lib/ws/server'),
    Game       = require('game'),
    url        = require('url');

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
    
    self.server.addListener("listening", function() {
      sys.log("Listening...");
    });
    
    self.game = new Game(self.server);
  }
  
  function createHTTPServer() {
    return http.createServer(function(req, res) {
      var file = new nodeStatic.Server('./public', { cache: false });
      
      req.addListener("end", function() {
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
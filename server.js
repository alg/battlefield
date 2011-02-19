require.paths.unshift(__dirname + "/vendor");
require.paths.unshift(__dirname + "/lib");

var opts = require('js-opts/js/opts');
var portNumber = 8000;
var options = [{
  short:        'p',
  long:         'port',
  description:  'Server port number',
  value:        8000,
  callback:     function(v) { portNumber = parseInt(v) }
}];

opts.parse(options, true);

process.addListener("uncaughtException", function(err, stack) {
  console.log('----------------------');
  console.log('Exception: ' + err);
  console.log(err.stack);
  console.log('----------------------');
});

var Tanks = require('tanks');
new Tanks({ port: portNumber });


/**
 * More complex example.
 *
 * Run:
 *   node example2.js --help
 * and play with the options to see the behavior.
 *
 * This example shows different ways of using the library. It is deliberately 
 * inconsistent. Choose the style that suits you best.
 */

var opts = require('./../js/opts'); // default host value

var host = 'localhost';

var options = [
  { short       : 'v'
  , long        : 'version'
  , description : 'Show version and exit'
  , callback() { console.log('v1.0'); process.exit(1); }
  },
  { short       : 'l'
  , long        : 'list'
  , description : 'List all files'
  },
  { short       : 'f'
  , long        : 'file'
  , description : 'Load a file'
  , value       : true
  , required    : true
  },
  { short       : 'd'
  , long        : 'debug'
  , description : 'Set a debug level'
  , value       : true
  },
  { short       : 'h'
  , long        : 'host'
  , description : 'The hostname to connect to'
  , value       : true
  , callback(value) { host = value; } // override host value
  },
  { short       : 'p'
  , long        : 'port'
  , description : 'The port to connect to'
  , value       : true
  },
];

opts.parse(options, true);

var // default port value
port  = opts.get('port') || 8000;

var // default debug value
debug = opts.get('d') || 'info';

var file  = opts.get('f');
var list  = opts.get('list');
var arg1 = opts.args()[0];
var arg2 = opts.args()[1];


if (list) console.log('List arg was set');
if (file) console.log('File arg was set: ' + file);
console.log('Debug level is: ' + debug);
console.log('Host is: ' + host);
console.log('Port is: ' + port);

if (arg1) console.log('Extra arg 1: ' + arg1);
if (arg2) console.log('Extra arg 2: ' + arg2);

process.exit(0);


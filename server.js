require.paths.unshift(__dirname + "/vendor");
require.paths.unshift(__dirname + "/lib");

process.addListener("uncaughtException", function(err, stack) {
  console.log('----------------------');
  console.log('Exception: ' + err);
  console.log(err.stack);
  console.log('----------------------');
});

var Tanks = require('tanks');
new Tanks({ port: 8000 });


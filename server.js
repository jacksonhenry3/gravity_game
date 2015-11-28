var connect = require('connect');
var serveStatic = require('serve-static');


port = 8000
connect().use(serveStatic(__dirname)).listen(port);
console.log("Running on localhost:"+port)
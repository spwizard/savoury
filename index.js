'use strict';

var express = require('express'),
    http = require('http'),
    app = express(),
    port = process.env.PORT || 8008;

app.use('/', express.static(__dirname + '/'));

app.get('*', function(req, res) {
  res.sendFile('/index.html', {
    root: __dirname
  });
});

http.createServer(app).listen(port);

console.log('Express server listening on port ' + port);

/*
 * localhost:8001
 */

 /*jslint node: true */

 'use strict';

var express = require('express'),
    http = require('http'),
    stylus = require('stylus'),
    nib = require('nib'),
    app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('sourcemap', {
      inline: true
    })
    .set('include css', true)
    .use(nib());
}

app.use(stylus.middleware({
    src: __dirname,
    compile: compile
  })
);

app.use('/', express.static(__dirname + '/'));

app.get('*', function(req, res) {
  res.sendFile('/index.html', {
    root: __dirname
  });
});

//https.createServer(options, app).listen(8008);
http.createServer(app).listen(8008);

console.log('Express server listening on port 8008');

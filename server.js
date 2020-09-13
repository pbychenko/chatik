var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// app.set('view engine', 'pug');
app.use('/assets', express.static(__dirname + '/dist/public'));
var port = '3000';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

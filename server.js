var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// app.set('view engine', 'pug');
app.use('/assets', express.static(__dirname + '/dist/public'));
var port = '8080';

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

io.on('connection', (client) => {
  client.on('chat message', (msg) => {
    io.emit('chat message', { message: msg });
  });
  client.on('disconnect', () => {
    console.log(`user has disconnected`)
  })

});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.render('index');
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

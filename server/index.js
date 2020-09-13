var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var path = require('path');

app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index.pug', { title: 'Hey', message: 'Hello there!'});
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

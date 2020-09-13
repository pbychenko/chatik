var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var port = process.env.PORT || 8080;
var path = require('path');
var cors = require("cors");

// app.set('view engine', 'pug');
app.use('/assets', express.static(__dirname + '/dist/public'));
// app.use(cors());

// if ( process.env.NODE_ENV != 'production' ) {
//   var browserSync = require('browser-sync');
//   browserSync({
//     files: ['./**/*'],
//     online: false,
//     port: 9000,
//     proxy: 'localhost:8080',
//     ui: false,
//   });
// }
// app.use(app.static(path.join(__dirname, 'public')));
var port = '3000';
// app.set('port', port);


// app.get('/', function (req, res) {
//   res.render('index');
// });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

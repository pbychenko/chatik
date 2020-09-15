var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
// var cors = require('cors')

// app.set('view engine', 'pug');
// app.use(cors());
app.use('/assets', express.static(__dirname + '/dist/public'));
var port = '8080';

const messages = ['s', 'd'];
// const obj1 = [1,2,3];

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });  

io.on('connection', (socket) => {
  console.log(`user connected`)
  // client.on('chat message', (msg) => {
  //   io.emit('chat message', { message: msg });
  // });
  // client.on('testCon', (data) => {
  //   io.emit('testCon', obj);
  // });

  socket.on('testCon', (data) => {
    // we tell the client to execute 'new message'
    console.log(data);
    messages.push(data);
    console.log(messages);

    // socket.broadcast.emit('testCon1', obj);
    socket.emit('testCon1', messages);
  });


  socket.on('disconnect', () => {
    console.log(`user has disconnected`)
  })

});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.render('index');
});

app.get('/messages', (req, res) => {
  return res.send(messages);
});

// app.get('/example/a', function (req, res) {
//   res.send('Hello from A!');
// });

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

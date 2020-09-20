var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var cors = require('cors');
var _ = require('lodash');

// app.set('view engine', 'pug');
app.use(cors());
app.use('/assets', express.static(__dirname + '/dist/public'));
var port = '8080';

// const messages = ['Привет мля'];
const channel1Id = _.uniqueId();
const channel2Id = _.uniqueId();

const channels = [
  {
    id: channel1Id,
    name: 'general',
  },
  {
    id: channel2Id,
    name: 'test',
  },
];

const channelsMessages = {
  [channel1Id]: ['канал general'],
  [channel2Id]: ['канал test'],
};

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
    // console.log(data);
    const { channelId, message } = data;
    channelsMessages[channelId].push(message);
    console.log(channelsMessages);

    // socket.broadcast.emit('testCon1', obj);
    socket.emit('testCon1', channelsMessages);
    socket.broadcast.emit('testCon1', channelsMessages);
  });


  socket.on('disconnect', () => {
    console.log(`user has disconnected`)
  })

});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.render('index');
});

app.get('/messages', cors(), (req, res) => {
  return res.send(messages);
});

app.get('/channels', cors(), (req, res) => {
  return res.send(channels);
});

app.get('/channelsMessages', cors(), (req, res) => {
  return res.send(channelsMessages);
});

// app.get('/example/a', function (req, res) {
//   res.send('Hello from A!');
// });

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

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

// const state = {
//   channels: [
//     {
//       id: channel1Id,
//       name: 'general',
//     },
//     {
//       id: channel2Id,
//       name: 'test',
//     },
//   ],
//   channelsMessages: {
//     [channel1Id]: ['канал general'],
//     [channel2Id]: ['канал test'],
//   },
// };

io.on('connection', (socket) => {
  console.log(`user connected`);

  socket.on('add user', () => {
    socket.emit('user joined', { channels, channelsMessages });
    // socket.broadcast.emit('user joined', { channels, channelsMessages });
  });

  socket.on('new message', (data) => {
    const { channelId, message } = data;
    channelsMessages[channelId].push(message);
    console.log(channelsMessages);

    socket.emit('new message', channelsMessages);
    socket.broadcast.emit('new message', channelsMessages);
  });

  socket.on('disconnect', () => {
    console.log(`user has disconnected`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/channels', cors(), (req, res) => {
  return res.send(channels);
});

app.get('/channelsMessages', cors(), (req, res) => {
  return res.send(channelsMessages);
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

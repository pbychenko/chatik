const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const path = require('path');
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.set('view engine', 'pug');
app.use(cors());
app.use('/assets', express.static(__dirname + '/dist/public'));
app.use(bodyParser());
// app.use(json());
// app.use(express.json())
var port = '8080';

// const messages = ['Привет мля'];
const channel1Id = _.uniqueId();
const channel2Id = _.uniqueId();

let channels = [
  {
    id: channel1Id,
    name: 'general',
  },
  {
    id: channel2Id,
    name: 'temp',
  },
];

let channelsMessages = {
  [channel1Id]: ['канал general'],
  [channel2Id]: ['канал test'],
};

const users = [
  {
    id:  _.uniqueId(),
    name: 'Tuktuk',
  },
  {
    id:  _.uniqueId(),
    name: 'Bumbum',
  },
  {
    id:  _.uniqueId(),
    name: 'Tiktok',
  },
];
// let users = {
//   [channel1Id]: ['канал general'],
//   [channel2Id]: ['канал test'],
// };

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

  // socket.on('new message', (data) => {
  //   const { channelId, message } = data;
  //   channelsMessages[channelId].push(message);
  //   console.log(channelsMessages);

  //   socket.emit('new message', channelsMessages);
  //   socket.broadcast.emit('new message', channelsMessages);
  // });

  // socket.on('new channel', () => {
  //   // const channelId = _.uniqueId();
  //   // channels.push({ id: channelId, name: newChannelName });
  //   // channelsMessages[channelId] = ['Новое сообщение'];
  //   console.log(channels);

  //   socket.emit('new channel', { channels, channelsMessages });
  //   socket.broadcast.emit('new channel', { channels, channelsMessages });
  // });

  // socket.on('delete channel', (channelId) => {
  //   channels = channels.filter((el) => el.id !== channelId);
  //   delete channelsMessages[channelId];
  //   console.log(channels);

  //   socket.emit('delete channel', { channels });
  //   socket.broadcast.emit('delete channel', { channels });
  // });

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

app.post('/deleteChannel', cors(), urlencodedParser, (req, res) => {
  const { channelId } = req.body;
  channels = channels.filter((el) => el.id !== channelId);
  console.log(channels);
  delete channelsMessages[channelId];
  io.emit('delete channel', { channels, channelsMessages });
  res.sendStatus(200);
});

app.post('/addChannel', cors(), urlencodedParser, (req, res) => {
  const channelId = _.uniqueId();
  const { channelName } = req.body;
  channels.push({ id: channelId, name: channelName });
  channelsMessages[channelId] = ['Новое сообщение'];
  console.log(channels);
  io.emit('new channel', { channels, channelsMessages });
  res.sendStatus(200);
});

app.post('/newMessage', cors(), urlencodedParser, (req, res) => {
  const { channelId, message } = req.body;
  channelsMessages[channelId].push(message);
  console.log(channelsMessages);

  io.emit('new message', channelsMessages);
  // socket.broadcast.emit('new message', channelsMessages);
  res.sendStatus(200);
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

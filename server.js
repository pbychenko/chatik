var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var cors = require('cors');
var _ = require('lodash');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.set('view engine', 'pug');
app.use(cors());
app.use('/assets', express.static(__dirname + '/dist/public'));
app.use(bodyParser());
// app.use(json());
app.use(express.json())
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
    name: 'test',
  },
];

let channelsMessages = {
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

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const path = require('path');
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.set('view engine', 'pug');
app.use(cors());
app.use('/assets', express.static(__dirname + '/dist/public'));
app.use(bodyParser());
const port = '8080';
const channel1Id = _.uniqueId();
const channel2Id = _.uniqueId();

let commonChannels = [
  {
    id: channel1Id,
    name: 'general',
  },
  {
    id: channel2Id,
    name: 'temp',
  },
];

const channelsMessages = {
  [channel1Id]: [],
  [channel2Id]: [],
};

const users = [
  {
    id: _.uniqueId(),
    name: 'Tuktuk',
    channels: [channel1Id, channel2Id],
  },
  {
    id: _.uniqueId(),
    name: 'Bumbum',
    channels: [channel1Id, channel2Id],
  },
];

io.on('connection', (socket) => {
  console.log('user connected');

  // socket.on('add user', () => {
  //   socket.emit('user joined', { channels: commonChannels, channelsMessages });
  // });

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
    console.log('user has disconnected');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/channels', cors(), (req, res) => res.send(commonChannels));


// app.get('/channels', cors(), (req, res) => { // res.send(commonChannels));
//   const { userId } = req.query;
//   if (userId !== null) {
//     const currentUser = _.find(users, { id: userId });
//     // const currentUserChannels = currentUser.channels;

//   //   const filteredChannels = commonChannels.filter((channel) => currentUserChannels.some(id => id === channel.id));
//   //   // console.log(users);
//   //   res.send({ channels: filteredChannels });
//   // } else {
//   //   res.send(commonChannels);
//   }
// });  
app.get('/users', cors(), (req, res) => {
  const { userId } = req.query;
  if (userId !== null) {
    const filteredUsers = users.filter((user) => user.id !== userId);
    // console.log(users);
    res.send({ users: filteredUsers });
  } else {
    res.send(users);
  }
});

app.get('/channelsMessages', cors(), (req, res) => res.send(channelsMessages));

app.post('/deleteChannel', cors(), urlencodedParser, (req, res) => {
  const { channelId } = req.body;
  commonChannels = commonChannels.filter((el) => el.id !== channelId);
  // console.log(commonChannels);
  delete channelsMessages[channelId];
  io.emit('delete channel', { channels: commonChannels, channelsMessages });
  res.sendStatus(200);
});

app.post('/addChannel', cors(), urlencodedParser, (req, res) => {
  const channelId = _.uniqueId();
  const { channelName } = req.body;
  commonChannels.push({ id: channelId, name: channelName });
  channelsMessages[channelId] = [];
  console.log(commonChannels);
  io.emit('new channel', { channels: commonChannels, channelsMessages });
  res.sendStatus(200);
});

app.post('/addUserChannel', cors(), urlencodedParser, (req, res) => {
  const channelId = _.uniqueId();
  const { currentUserId, newUserId } = req.body;
  // console.log(currentUserId);
  // console.log(newUserId);


  commonChannels.push({ id: channelId, name: `${currentUserId}/${newUserId}` });
  channelsMessages[channelId] = [];
  const currentUser = _.find(users, { id: currentUserId });
  // console.log(currentUser);
  const otherUser = _.find(users, { id: newUserId });
  // console.log(otherUser);
  currentUser.channels.push(channelId);
  otherUser.channels.push(channelId);
  // console.log(users);

  // console.log(commonChannels);
  // io.emit('new user channel', { channels: commonChannels, channelsMessages, currentUserId, newUserId });
  res.sendStatus(200);
});

app.post('/addUser', cors(), urlencodedParser, (req, res) => {
  const userId = _.uniqueId();
  const { userName } = req.body;
  users.push({ id: userId, name: userName, channels: [channel1Id, channel2Id] });
  // console.log(users);
  // const filteredUsers = users.filter((user) => user.id !== userId);
  // console.log(filteredUsers);
  // console.log(userId);
  // res.send(userId);
  io.emit('new user', { users, userId, userName });
});

app.post('/newMessage', cors(), urlencodedParser, (req, res) => {
  const {
    channelId,
    message,
    userName,
    messageDate,
  } = req.body;
  const newMessage = { user: userName, text: message, date: messageDate };
  channelsMessages[channelId].push(newMessage);
  console.log(channelsMessages);

  io.emit('new message', channelsMessages);
  // socket.broadcast.emit('new message', channelsMessages);
  res.sendStatus(200);
});

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

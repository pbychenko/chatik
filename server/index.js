const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const path = require('path');
const router = require('express').Router();
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const channels = require('./routes/channels');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.set('view engine', 'pug');
app.use(cors());
app.use('/assets', express.static(__dirname + '/dist/public'));
app.use(express.json());
const port = '8080';
// const channel1Id = _.uniqueId();
// const channel2Id = _.uniqueId();

// let commonChannels = [
//   {
//     id: channel1Id,
//     name: 'general',
//   },
//   {
//     id: channel2Id,
//     name: 'temp',
//   },
// ];

// const channelsMessages = {
//   [channel1Id]: [],
//   [channel2Id]: [],
// };

// const users = [
//   {
//     id: _.uniqueId(),
//     name: 'Tuktuk',
//     channels: [channel1Id, channel2Id],
//   },
//   {
//     id: _.uniqueId(),
//     name: 'Bumbum',
//     channels: [channel1Id, channel2Id],
//   },
// ];

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user has disconnected');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/users', users(router, io));
// app.use('/channels', channels(router, io));

// app.get('/channels', cors(), (req, res) => { // res.send(commonChannels));
//   const { userId } = req.query;
//   if (userId !== 'null') {
//     const currentUser = _.find(users, { id: userId });
//     // console.log(userId);
//     // console.log(currentUser);
//     const currentUserChannels = currentUser.channels;
//     console.log('channels');
//     console.log(currentUser);
//     console.log(commonChannels);
//     console.log(currentUserChannels);
//     const filteredChannels = commonChannels.filter((channel) => currentUserChannels.some(id => id === channel.id));
//     // console.log(filteredChannels);
//     res.send(filteredChannels);
//     // res.send(commonChannels);
//   } else {
//     res.send(commonChannels);
//   }
// });
  
// app.get('/users', cors(), (req, res) => {
//   const { userId } = req.query;
//   if (userId !== null) {
//     const filteredUsers = users.filter((user) => user.id !== userId);
//     // console.log(users);
//     res.send({ users: filteredUsers });
//   } else {
//     res.send(users);
//   }
// });

// app.get('/channelsMessages', cors(), (req, res) => res.send(channelsMessages));

// app.post('/deleteChannel', cors(), urlencodedParser, (req, res) => {
//   const { channelId } = req.body;
//   commonChannels = commonChannels.filter((el) => el.id !== channelId);
//   // console.log(commonChannels);
//   delete channelsMessages[channelId];
//   users.forEach((user) => {
//     // const newUserChannels = [...user.channels];
//     console.log(user.channels);
//     console.log(typeof channelId);
//     const newUserChannels = user.channels.filter(channel => channel !== channelId);
//     user.channels = newUserChannels;
//     console.log(user.channels);
//   });
//   io.emit('delete channel', { channels: commonChannels, channelsMessages, channelId });
//   res.sendStatus(200);
// });

// app.post('/addChannel', cors(), urlencodedParser, (req, res) => {
//   const channelId = _.uniqueId();
//   const { channelName } = req.body;
//   const newChannel = { id: channelId, name: channelName };
//   commonChannels.push(newChannel);
//   users.forEach((user) => {
//     user.channels.push(channelId);
//   });
//   console.log('add channel');
//   console.log(commonChannels);
//   channelsMessages[channelId] = [];
//   io.emit('new channel', { channels: commonChannels, channelsMessages, newChannel });
//   res.sendStatus(200);
// });

// app.post('/addUserChannel', cors(), urlencodedParser, (req, res) => {
//   const channelId = _.uniqueId();
//   const { currentUserId, newUserId } = req.body;
//   // console.log(currentUserId);
//   // console.log(newUserId);
//   const currentUser = _.find(users, { id: currentUserId });
//   const otherUser = _.find(users, { id: newUserId });
//   console.log(currentUser);

//   commonChannels.push({ id: channelId, name: `${currentUserId}/${newUserId}` });
//   channelsMessages[channelId] = [];
//   currentUser.channels.push(channelId);
//   otherUser.channels.push(channelId);
//   console.log(users);

//   // // console.log(commonChannels);
//   io.emit('new user channel', {
//     channels: commonChannels,
//     channelsMessages,
//     currentUserId,
//     newUserId,
//     currentUserChannels: currentUser.channels,
//     otherUserChannels: otherUser.channels,
//   });
//   res.sendStatus(200);
// });

// app.post('/addUser', cors(), urlencodedParser, (req, res) => {
//   const userId = _.uniqueId();
//   const { userName } = req.body;
//   users.push({ id: userId, name: userName, channels: [channel1Id, channel2Id] });
//   // console.log(users);
//   // const filteredUsers = users.filter((user) => user.id !== userId);
//   // console.log(filteredUsers);
//   // console.log(userId);
//   // res.send(userId);
//   io.emit('new user', { users });
//   res.send(userId);
// });

// app.post('/newMessage', cors(), urlencodedParser, (req, res) => {
//   const {
//     channelId,
//     message,
//     userName,
//     messageDate,
//   } = req.body;
//   const newMessage = { user: userName, text: message, date: messageDate };
//   channelsMessages[channelId].push(newMessage);
//   console.log(channelsMessages);

//   io.emit('new message', channelsMessages);
//   // socket.broadcast.emit('new message', channelsMessages);
//   res.sendStatus(200);
// });

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

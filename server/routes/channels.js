const _ = require('lodash');
let commonChannels = require('../data');
const users = require('../data');
const channelsMessages = require('../data');

const channelsRouter = (router, io) => {
  router.get('/', (req, res) => { // res.send(commonChannels));
    const { userId } = req.query;
    if (userId !== 'null') {
      const currentUser = _.find(users, { id: userId });
      // console.log(userId);
      // console.log(currentUser);
      const currentUserChannels = currentUser.channels;
      // console.log('channels');
      // console.log(currentUser);
      // console.log(commonChannels);
      // console.log(currentUserChannels);
      const filteredChannels = commonChannels.filter((channel) => currentUserChannels.some((id) => id === channel.id));
      // console.log(filteredChannels);
      res.send(filteredChannels);
      // res.send(commonChannels);
    } else {
      res.send(commonChannels);
    }
  });

  router.post('/add', (req, res) => {
    const channelId = _.uniqueId();
    const { channelName } = req.body;
    const newChannel = { id: channelId, name: channelName };
    commonChannels.push(newChannel);
    users.forEach((user) => {
      user.channels.push(channelId);
    });
    console.log('add channel');
    console.log(commonChannels);
    channelsMessages[channelId] = [];
    io.emit('new channel', { channels: commonChannels, channelsMessages, newChannel });
    res.sendStatus(200);
  });

  router.post('/addUserChannel', (req, res) => {
    const channelId = _.uniqueId();
    const { currentUserId, newUserId } = req.body;
    // console.log(currentUserId);
    // console.log(newUserId);
    const currentUser = _.find(users, { id: currentUserId });
    const otherUser = _.find(users, { id: newUserId });
    console.log(currentUser);

    commonChannels.push({ id: channelId, name: `${currentUserId}/${newUserId}` });
    channelsMessages[channelId] = [];
    currentUser.channels.push(channelId);
    otherUser.channels.push(channelId);
    console.log(users);

    // // console.log(commonChannels);
    io.emit('new user channel', {
      channels: commonChannels,
      channelsMessages,
      currentUserId,
      newUserId,
      currentUserChannels: currentUser.channels,
      otherUserChannels: otherUser.channels,
    });
    res.sendStatus(200);
  });

  //заменить на delete
  router.post('/delete', (req, res) => {
    const { channelId } = req.body;
    commonChannels = commonChannels.filter((el) => el.id !== channelId);
    // console.log(commonChannels);
    delete channelsMessages[channelId];
    users.forEach((user) => {
      // const newUserChannels = [...user.channels];
      console.log(user.channels);
      console.log(typeof channelId);
      const newUserChannels = user.channels.filter((channel) => channel !== channelId);
      user.channels = newUserChannels;
      console.log(user.channels);
    });
    io.emit('delete channel', { channels: commonChannels, channelsMessages, channelId });
    res.sendStatus(200);
  });

  //  позже заменить на специфичный канал
  router.post('/message', (req, res) => {
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
};

module.exports = channelsRouter;

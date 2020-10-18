const router = require('express').Router();
const _ = require('lodash');
let { channels } = require('../data');
const { users } = require('../data');
const { messages } = require('../data');
const { getUserChannels } = require('../utils');
let { commonChannelsIds } = require('../data');

const channelsRouter = (io) => {
  // router.get('/', (req, res) => res.send(channels));

  router.get('/messages', (req, res) => {
    res.send(messages);
  });

  router.get('/:userId', (req, res) => { // res.send(commonChannels));
    const { userId } = req.params;

    if (userId !== 'null') {
      const currentUser = _.find(users, { id: userId });
      // const currentUserChannels = currentUser.channels;
      // const filteredChannels = channels.filter((channel) => currentUserChannels.some((id) => id === channel.id));
      const userChannels = getUserChannels(currentUser, channels);
      res.send(userChannels);
    } else {
      res.send(channels);
    }
  });
  

  //тут надо подумать!!
  // router.get('/:channelId/messages', (req, res) => { // res.send(commonChannels));
  //   const { userId } = req.params;

  //   if (userId !== 'null') {
  //     const currentUser = _.find(users, { id: userId });
  //     const currentUserChannels = currentUser.channels;
  //     // const currentUserChannelsMessages
  //     res.send(filteredChannels);
  //   } else {
  //     res.send(null);
  //   }
  // });

  router.post('/add', (req, res) => {
    const channelId = _.uniqueId();
    const { channelName } = req.body;
    const newChannel = { id: channelId, name: channelName };
    channels.push(newChannel);
    commonChannelsIds.push(channelId);
    users.forEach((user) => {
      user.channels.push(channelId);
    });
    messages[channelId] = [];
    io.emit('new channel', { newChannel });
    res.sendStatus(200);
  });

  router.post('/addPrivate', (req, res) => {
    const channelId = _.uniqueId();
    const { currentUserId, otherUserId } = req.body;
    const currentUser = _.find(users, { id: currentUserId });
    const otherUser = _.find(users, { id: otherUserId });
    const newChannel = { id: channelId, name: `${currentUserId}/${otherUserId}` };
    channels.push(newChannel);
    messages[channelId] = [];
    currentUser.channels.push(channelId);
    otherUser.channels.push(channelId);
    io.emit('new user channel', {
      currentUserId,
      otherUserId,
      newChannel,
    });
    res.sendStatus(200);
  });

  router.delete('/:channelId', (req, res) => {
    const { channelId } = req.params;
    channels = channels.filter((el) => el.id !== channelId);
    commonChannelsIds = commonChannelsIds.filter((el) => el !== channelId);
    // console.log(commonChannelsIds);
    delete messages[channelId];
    users.forEach((user) => {
      const newUserChannels = user.channels.filter((channel) => channel !== channelId);
      user.channels = newUserChannels;
    });
    io.emit('delete channel', { channelId });
    res.sendStatus(200);
  });

  router.post('/message', (req, res) => {
    const {
      channelId,
      message,
      userName,
      messageDate,
    } = req.body;
    const newMessage = { user: userName, text: message, date: messageDate };
    messages[channelId].push(newMessage);
    console.log(messages);

    io.emit('new message', { channelId, newMessage });
    res.sendStatus(200);
  });

  return router;
};

module.exports = channelsRouter;

const routes = (app, io, cors, urlencodedParser, users, commonChannels, channelsMessages) => {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/channels', cors(), (req, res) => res.send(commonChannels));
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

}
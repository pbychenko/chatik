const router = require('express').Router();
const _ = require('lodash');
const { users } = require('../data');
const { commonChannelsIds } = require('../data');

const usersRouter = (io) => {
  // router.get('/', (req, res) => {
  //   res.send(users);
  // });

  router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    if (userId !== null) {
      const filteredUsers = users.filter((user) => user.id !== userId);
      res.send({ users: filteredUsers });
    } else {
      res.send(users);
    }
  });

  router.post('/add', (req, res) => {
    const userId = _.uniqueId();
    const { userName } = req.body;
    const newUser = { id: userId, name: userName, channels: [...commonChannelsIds] };
    users.push(newUser);
    // io.emit('new user', { users });
    // io.emit('new user', newUser);
    res.send(userId);
    io.emit('new user', newUser);
  });

  return router;
};

module.exports = usersRouter;

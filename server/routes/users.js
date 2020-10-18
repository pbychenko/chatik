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
    users.push({ id: userId, name: userName, channels: [...commonChannelsIds] });
    io.emit('new user', { users });
    res.send(userId);
  });

  return router;
};

module.exports = usersRouter;

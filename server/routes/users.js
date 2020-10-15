const router = require('express').Router();
const _ = require('lodash');
const { users } = require('../data');

const channel1Id = _.uniqueId();
const channel2Id = _.uniqueId();

const usersRouter = (io) => {
  router.get('/', (req, res) => {
    res.send(users);
  });

  router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    if (userId !== null) {
      const filteredUsers = users.filter((user) => user.id !== userId);
      res.send({ users: filteredUsers });
    } else {
      res.send(users);
    }
    res.send(users);
  });

  router.post('/add', (req, res) => {
    const userId = _.uniqueId();
    const { userName } = req.body;
    users.push({ id: userId, name: userName, channels: [channel1Id, channel2Id] }); ///?  какая то хуйня!!!
    // console.log(users);
    // const filteredUsers = users.filter((user) => user.id !== userId);
    // console.log(filteredUsers);
    // console.log(userId);
    // res.send(userId);
    io.emit('new user', { users });
    res.send(userId);
  });

  return router;
};

module.exports = usersRouter;

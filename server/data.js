const _ = require('lodash');

const channel1Id = _.uniqueId();
const channel2Id = _.uniqueId();

const commonChannelsIds = [channel1Id, channel2Id];

const channels = [
  {
    id: channel1Id,
    name: 'general',
  },
  {
    id: channel2Id,
    name: 'temp',
  },
];

const users = [
  {
    id: _.uniqueId(),
    name: 'Tuktuk',
    channels: [...commonChannelsIds],
  },
  {
    id: _.uniqueId(),
    name: 'Bumbum',
    channels: [...commonChannelsIds],
  },
];

const messages = {
  [commonChannelsIds[0]]: ['rww', 'rwrwa'],
  [commonChannelsIds[1]]: [],
};

exports.channels = channels;
exports.commonChannelsIds = commonChannelsIds;
exports.users = users;
exports.messages = messages;

const _ = require('lodash');

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

const channelsMessages = {
  [channel1Id]: [],
  [channel2Id]: [],
};

exports.commonChannels = commonChannels;
exports.users = users;
exports.channelsMessages = channelsMessages;

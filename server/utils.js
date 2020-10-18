const getUserChannels = (user, channels) => {
  const userChannelsIds = user.channels;
  const userChannels = channels
    .filter((channel) => userChannelsIds.some((id) => id === channel.id));
  return userChannels;
};

exports.getUserChannels = getUserChannels;

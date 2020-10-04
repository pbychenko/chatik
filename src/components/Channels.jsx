import React from 'react';
import {
  ListGroup,
} from 'react-bootstrap';

const Channels = (props) => {
  const { selectedChannel, channels, selectChannel } = props;

  return (
      <ListGroup variant="flush">
        {channels.map((channel) =>
          (<ListGroup.Item
            key={channel.id}
            style={{ wordWrap: 'break-word', textAlign: 'left' }}
            onClick={selectChannel(channel.id)}
            className={ channel.id === selectedChannel ? 'active' : null}
            >
            {channel.name}</ListGroup.Item>))}
      </ListGroup>);
};

export default Channels;

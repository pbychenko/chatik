import React from 'react';
import {
  ListGroup,
} from 'react-bootstrap';

const DeleteChannels = ({ channels, deleteChannel }) => (
    <ListGroup variant="flush">
    {channels.map((channel) => (
    <ListGroup.Item
       key={channel.id}
       style={{ cursor: 'pointer' }}
       onClick={deleteChannel(channel.id)}
       >X</ListGroup.Item>))}
    </ListGroup>);

export default DeleteChannels;

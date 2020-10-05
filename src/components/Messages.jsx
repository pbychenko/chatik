import React from 'react';
import _ from 'lodash';
import { ListGroup } from 'react-bootstrap';
import Message from './Message.jsx';

const Messages = (props) => {
  const { visibleMessages } = props;
  console.log(_.uniqueId());

  return (
    <ListGroup variant="flush">
      {visibleMessages.map((message) => (
      <ListGroup.Item key={_.uniqueId()} style={{ wordWrap: 'break-word', textAlign: 'right' }}>
        <Message userName={message.user} text={message.text} date={message.date} />
      </ListGroup.Item>))}
    </ListGroup>);
};

export default Messages;

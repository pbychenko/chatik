import React from 'react';
import { Card } from 'react-bootstrap';

const Message = (props) => {
  const { userName, text } = props;
  const newDate = new Date().toDateString();

  return (
    <Card style={{ width: '18rem' }}>
    <Card.Body>
      <Card.Title>{userName}</Card.Title>
      <Card.Text>
        {text}
      </Card.Text>
      {/* <Card.Text>
        {newDate}
      </Card.Text> */}
    </Card.Body>
  </Card>);
};

export default Message;

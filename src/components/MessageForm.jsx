import React from 'react';
import { Form, Col, Button } from 'react-bootstrap';

const MessageForm = (props) => {
  const { message, submitMessage, writeMessage } = props;

  return (
    <Form onSubmit={submitMessage}>
      <Form.Row>
        <Col lg={10} xs={12} style={{ marginBottom: '10px' }}>
          <Form.Control type="text" placeholder="Write your message here" name="message" onChange={writeMessage} value={message} />
        </Col>
        <Col lg={2} xs={12}>
          <Button variant="primary" type="submit" block >Send</Button>
        </Col>
      </Form.Row>
    </Form>);
};

export default MessageForm;

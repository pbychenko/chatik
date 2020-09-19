import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import openSocket from 'socket.io-client';
import axios from 'axios';
import {
  Spinner,
  Alert,
  ListGroup,
  Container,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';

const socket = openSocket('http://localhost:8080');
const baseUrl = 'http://localhost:8080';
const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
};
const spinnerSizeStyle = {
  width: '13rem',
  height: '13rem',
};

// const borde = {
//   borderStyle: 'solid',
//   borderColor: 'green',
// };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: '',
      requestState: '',
      showErrorBlock: false,
    };
  }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        const initMessages = await axios.get(`${baseUrl}/messages`);
        this.setState({
          requestState: 'success',
          messages: initMessages.data.slice(),
        });
      } catch (error) {
        this.setState({ requestState: 'failed' });
        throw error;
      }
    });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { messages, message } = this.state;
    messages.push(message);
    this.setState({ message: '' });
    socket.emit('testCon', message);
    socket.on('testCon1', (messages) => {
      console.log(messages);
      this.setState({ messages });
    });
  }

  render() {
    const { messages, message, requestState } = this.state;

    if (requestState === 'processing') {
      return (
        <div className="text-center" style = {centerStyle}>
          <Spinner animation="border" style={spinnerSizeStyle} />
        </div>
      );
    }

    if (requestState === 'success') {
      return (
        <>
          <Container>
            <Container>
              <Row>
                <Col xs={6} md={4}></Col>
                <Col xs={12} md={8}>
                  <ListGroup variant="flush">
                  {messages.map((message) => (<ListGroup.Item style={{wordWrap: 'break-word'}}>{message}</ListGroup.Item>))}
                  </ListGroup>
                </Col>
              </Row>
            </Container>
          <Form onSubmit={this.handleSubmit}>
            <Form.Row>
              <Col lg={11} xs={12} style={{ marginBottom: '10px' }}>
                <Form.Control type="text" placeholder="Readonly input here..." name="message" onChange={this.handleChange} value={message} />
              </Col>
              <Col lg={1} xs={12}>
                <Button variant="primary" type="submit" block >Send</Button>
              </Col>
            </Form.Row>
          </Form>
          </Container>
       </>
      );
    }
    return (
      <>
        <Alert variant='info' className="text-center">
          Something wrong with newtwork please try again later
        </Alert>
      </>
    );
  }
}

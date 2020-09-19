import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import openSocket from 'socket.io-client';
import axios from 'axios';
import _ from 'lodash';
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
      channels: [],
      channelsMessages: [],
      visibleMessages: [],
      selectedChannel: '',
      // messages: [],
      message: '',
      requestState: '',
      showErrorBlock: false,
    };
  }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        // const initMessages = await axios.get(`${baseUrl}/messages`);
        const initCannels = await axios.get(`${baseUrl}/channels`);
        const initMessages = await axios.get(`${baseUrl}/channelsMessages`);
        this.setState({
          requestState: 'success',
          channels: initCannels.data,
          messages: initMessages.data,
          selectedChannel: initCannels.data[0].id,
          visibleMessages: initMessages.data[initCannels.data[0].id],
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
    const { messages, message, selectedChannel } = this.state;
    messages[selectedChannel].push(message);
    this.setState({ message: '' });
    socket.emit('testCon', { channelId: selectedChannel, message });
    socket.on('testCon1', (messages) => {
      // console.log(messages);
      this.setState({ messages });
    });
  }

  handleSelectChannels = (id) => () => {
    // const { name, value } = e.target;
    const { messages } = this.state;
    console.log(id);
    const visibleMessages = messages[id];
    this.setState({ visibleMessages, selectedChannel: id });
  }

  render() {
    const { visibleMessages, message, requestState, channels, selectedChannel } = this.state;
    // console.log(messages);
    // console.log(channels);

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
              <Row>
                {/* <Col xs={6} md={4}></Col> */}
                <Col xs={12} md={4}>
                  <ListGroup variant="flush">
                  {channels.map((channel) =>
                    (<ListGroup.Item
                     key={channel.id}
                     style={{ wordWrap: 'break-word', textAlign: 'left' }}
                     onClick={this.handleSelectChannels(channel.id)}
                     className={ channel.id === selectedChannel ? 'active' : null}
                    //  active='false'
                     >
                      {channel.name}</ListGroup.Item>))}
                  </ListGroup>
                </Col>
                <Col xs={12} md={8}>
                  <ListGroup variant="flush">
                  {/* <ListGroup.Item style={{wordWrap: 'break-word', textAlign: 'right'}}>asds</ListGroup.Item>
                  <ListGroup.Item style={{wordWrap: 'break-word', textAlign: 'right'}}>sdsds</ListGroup.Item> */}
                  {visibleMessages.map((message) => (<ListGroup.Item key={_.uniqueId()} style={{ wordWrap: 'break-word', textAlign: 'right' }}>{message}</ListGroup.Item>))}
                  </ListGroup>
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
                </Col>
              </Row>
            </Container>
            {/* <Container>
              <Row>
                <Col xs={6} md={4}></Col>
                <Col xs={12} md={8}>
                  <ListGroup variant="flush">
                  {messages.map((message) => (<ListGroup.Item style={{wordWrap: 'break-word', textAlign: 'right'}}>{message}</ListGroup.Item>))}
                  </ListGroup>
                </Col>
              </Row>
            </Container> */}
          {/* <Form onSubmit={this.handleSubmit}>
            <Form.Row>
              <Col lg={11} xs={12} style={{ marginBottom: '10px' }}>
                <Form.Control type="text" placeholder="Readonly input here..." name="message" onChange={this.handleChange} value={message} />
              </Col>
              <Col lg={1} xs={12}>
                <Button variant="primary" type="submit" block >Send</Button>
              </Col>
            </Form.Row>
          </Form> */}
          {/* </Container> */}
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

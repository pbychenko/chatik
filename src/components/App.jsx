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
import MyModal from './MyModal.jsx';

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
      showModal: false,
      newChannelName: '',
      requestState: '',
      showErrorBlock: false,
    };
  }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        // const initCannels = await axios.get(`${baseUrl}/channels`);
        // const initMessages = await axios.get(`${baseUrl}/channelsMessages`);
        socket.emit('add user');
        socket.on('user joined', (data) => {
          // console.log('joined');
          const initCannels = data.channels;
          const initMessages = data.channelsMessages;
          this.setState({
            requestState: 'success',
            // channels: initCannels.data,
            // channelsMessages: initMessages.data,
            // selectedChannel: initCannels.data[0].id,
            // visibleMessages: initMessages.data[initCannels.data[0].id],
            channels: initCannels,
            channelsMessages: initMessages,
            selectedChannel: initCannels[0].id,
            visibleMessages: initMessages[initCannels[0].id],
          });
          // const visibleMessages = messages[selectedChannel];
          // this.setState({ channelsMessages: messages, visibleMessages });
        });
        socket.on('new message', (messages) => {
          // console.log(messages);
          const { selectedChannel } = this.state;
          const visibleMessages = messages[selectedChannel];
          this.setState({ channelsMessages: messages, visibleMessages });
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
    const { channelsMessages, message, selectedChannel } = this.state;
    channelsMessages[selectedChannel].push(message);
    this.setState({ message: '' });
    socket.emit('new message', { channelId: selectedChannel, message });
  }

   handleSelectChannels = (id) => () => {
    // const { name, value } = e.target;
    const { channelsMessages } = this.state;
    // console.log(id);
    const visibleMessages = channelsMessages[id];
    this.setState({ visibleMessages, selectedChannel: id });
  }

  handleDeleteChannel = (id) => () => {
    axios.post(`${baseUrl}/deleteChannel`, {
      channelId: id.toString(),
    })
      .then((res) => {
        // const { channels } = this.state;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleAddChannel = (e) => {
    e.preventDefault();
    const { newChannelName } = this.state;
    // channelsMessages[selectedChannel].push(message);
    this.setState({ newChannelName: '' });
    // socket.emit('new message', { channelId: selectedChannel, message });
    axios.post(`${baseUrl}/addChannel`, {
      channelName: newChannelName,
    })
      .then((res) => {
        // const { channels } = this.state;
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ newChannelName: '', showModal: false });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleShowModal = () => {
    this.setState({ showModal: true });
  }

  render() {
    const { visibleMessages, message, requestState, channels, selectedChannel, showModal, newChannelName } = this.state;

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
                <Col xs={10} md={3}>
                  <ListGroup variant="flush">
                  {channels.map((channel) =>
                    (<ListGroup.Item
                     key={channel.id}
                     style={{ wordWrap: 'break-word', textAlign: 'left' }}
                     onClick={this.handleSelectChannels(channel.id)}
                     className={ channel.id === selectedChannel ? 'active' : null}
                     >
                      {channel.name}</ListGroup.Item>))}
                    <ListGroup.Item><Button variant="primary" type="submit" block onClick={this.handleShowModal}>Add channel</Button></ListGroup.Item>
                    <MyModal show={showModal} onFormChange={this.handleChange} onFormSubmit={this.handleAddChannel} newChannelName={newChannelName} onHide={this.handleCloseModal} />
                  </ListGroup>
                </Col>
                <Col xs={2} md={1}>
                  <ListGroup variant="flush">
                  {channels.map((channel) =>
                    (<ListGroup.Item
                     key={channel.id}
                     style={{ cursor: 'pointer' }}
                     onClick={this.handleDeleteChannel(channel.id)}
                    //  className={ channel.id === selectedChannel ? 'active' : null}
                     >X</ListGroup.Item>))}
                    {/* <ListGroup.Item><Button variant="primary" type="submit" block onClick={this.handleAddChannel}>Add channel</Button></ListGroup.Item> */}
                  </ListGroup>
                </Col>
                <Col xs={12} md={8}>
                  <ListGroup variant="flush">
                  {visibleMessages.map((message) => (<ListGroup.Item key={_.uniqueId()} style={{ wordWrap: 'break-word', textAlign: 'right' }}>{message}</ListGroup.Item>))}
                  </ListGroup>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                      <Col lg={10} xs={12} style={{ marginBottom: '10px' }}>
                        <Form.Control type="text" placeholder="Readonly input here..." name="message" onChange={this.handleChange} value={message} />
                      </Col>
                      <Col lg={2} xs={12}>
                        <Button variant="primary" type="submit" block >Send</Button>
                      </Col>
                    </Form.Row>
                  </Form>
                </Col>
              </Row>
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

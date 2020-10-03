import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import openSocket from 'socket.io-client';
import _ from 'lodash';
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
import MyModal from './MyModal.jsx';
import RegisterModal from './RegisterModal.jsx';
import Message from './Message.jsx';

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
      registered: false,
      channels: [],
      channelsMessages: [],
      visibleMessages: [],
      selectedChannel: '',
      message: '',
      showModal: false,
      userName: '',
      newChannelName: '',
      requestState: '',
      showErrorBlock: false,
    };
  }

  // componentDidMount() {
  //   this.setState({ requestState: 'processing' }, async () => {
  //     try {
  //       // const initCannels = await axios.get(`${baseUrl}/channels`);
  //       // const initMessages = await axios.get(`${baseUrl}/channelsMessages`);
  //       socket.emit('add user');
  //       socket.on('user joined', (data) => {
  //         const initCannels = data.channels;
  //         const initMessages = data.channelsMessages;
  //         this.setState({
  //           requestState: 'success',
  //           // channels: initCannels.data,
  //           // channelsMessages: initMessages.data,
  //           // selectedChannel: initCannels.data[0].id,
  //           // visibleMessages: initMessages.data[initCannels.data[0].id],
  //           channels: initCannels,
  //           channelsMessages: initMessages,
  //           selectedChannel: initCannels[0].id,
  //           visibleMessages: initMessages[initCannels[0].id],
  //         });
  //       });
  //       socket.on('new message', (messages) => {
  //         const { selectedChannel } = this.state;
  //         const visibleMessages = messages[selectedChannel];
  //         this.setState({ channelsMessages: messages, visibleMessages });
  //       });
  //       socket.on('new channel', (data) => {
  //         this.setState({ channels: data.channels, channelsMessages: data.channelsMessages });
  //       });
  //       socket.on('delete channel', (data) => {
  //         this.setState({ channels: data.channels });
  //       });
  //     } catch (error) {
  //       this.setState({ requestState: 'failed' });
  //       throw error;
  //     }
  //   });
  // }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        const initCannels = await axios.get(`${baseUrl}/channels`);
        const initMessages = await axios.get(`${baseUrl}/channelsMessages`);
        this.setState({
          requestState: 'success',
          channels: initCannels.data,
          channelsMessages: initMessages.data,
          selectedChannel: initCannels.data[0].id,
          visibleMessages: initMessages.data[initCannels.data[0].id],
        });
        socket.on('new message', (messages) => {
          const { selectedChannel } = this.state;
          const visibleMessages = messages[selectedChannel];
          this.setState({ channelsMessages: messages, visibleMessages });
        });
        socket.on('new channel', (data) => {
          this.setState({ channels: data.channels, channelsMessages: data.channelsMessages });
        });
        socket.on('delete channel', (data) => {
          this.setState({ channels: data.channels });
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
    const { message, selectedChannel, userName } = this.state;
    // this.setState({ message: '' });
    // socket.emit('new message', { channelId: selectedChannel, message });
    // axios.post(`${baseUrl}/newMessage`, { channelId: selectedChannel, message })
    axios.post(`${baseUrl}/newMessage`, { channelId: selectedChannel, message, userName })
      .then((res) => {
        // console.log('here');
        // socket.emit('new channel', newChannelName);
        // console.log('here');
        this.setState({ message: '' });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSelectChannels = (id) => () => {
    const { channelsMessages } = this.state;
    const visibleMessages = channelsMessages[id];
    this.setState({ visibleMessages, selectedChannel: id });
  }

  handleDeleteChannel = (id) => () => {
    axios.post(`${baseUrl}/deleteChannel`, {
      channelId: id,
    })
    .then((res) => {
      // const { channels } = this.state;
    })
    .catch((error) => {
      console.log(error);
    });

    // socket.emit('delete channel', id);
  }

  handleAddChannel = (e) => {
    e.preventDefault();
    const { newChannelName } = this.state;
    axios.post(`${baseUrl}/addChannel`, {
      channelName: newChannelName,
    })
      .then((res) => {
        // console.log('here');
        // socket.emit('new channel', newChannelName);
        console.log('here');
        this.setState({ newChannelName: '', showModal: false });
      })
      .catch((error) => {
        console.log(error);
      });

    // socket.emit('new channel', newChannelName);
    // this.setState({ newChannelName: '', showModal: false });
  }

  handleAddUser = (e) => {
    e.preventDefault();
    const { userName } = this.state;
    axios.post(`${baseUrl}/addUser`, { userName })
      .then((res) => {
        // console.log('here');
        // socket.emit('new channel', newChannelName);
        console.log('heres');
        this.setState({ registered: true });
      })
      .catch((error) => {
        console.log(error);
      });

    // socket.emit('new channel', newChannelName);
    // this.setState({ newChannelName: '', showModal: false });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleShowModal = () => {
    this.setState({ showModal: true });
  }

  render() {
    console.log(visibleMessages);
    const { visibleMessages, message, requestState, channels, selectedChannel, showModal, newChannelName, registered, userName } = this.state;

    if (!registered) {
      return (
        <RegisterModal onFormChange={this.handleChange} onFormSubmit={this.handleAddUser} userName={userName} onHide={this.handleCloseModal} />
      );
    }


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
                     >X</ListGroup.Item>))}
                  </ListGroup>
                </Col>
                <Col xs={12} md={8}>
                  <ListGroup variant="flush">
                  {/* {visibleMessages.map((message) => (
                    <ListGroup.Item key={_.uniqueId()} style={{ wordWrap: 'break-word', textAlign: 'right' }}>
                      <Message userName={message.user} text= {message.text} />{message}
                    </ListGroup.Item>))} */}
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
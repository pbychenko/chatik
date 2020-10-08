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
  Button,
} from 'react-bootstrap';
import MyModal from './MyModal.jsx';
import RegisterModal from './RegisterModal.jsx';
import Channels from './Channels.jsx';
import DeleteChannels from './DeleteChannels.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import Users from './Users.jsx';

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registered: sessionStorage.getItem('registered'),
      channels: [],
      channelsMessages: [],
      // users: [],
      // visibleUsers: [],
      // selectedUser: '',
      visibleMessages: [],
      selectedChannel: '',
      message: '',
      showModal: false,
      // userName: sessionStorage.getItem('user'),
      userName: sessionStorage.getItem('userName') || '',
      userId: sessionStorage.getItem('userId'),
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
        const initUsers = await axios.get(`${baseUrl}/users?userId=${this.state.userId}`);
        // console.log(initUsers.data);
        const initMessages = await axios.get(`${baseUrl}/channelsMessages`);
        this.setState({
          requestState: 'success',
          users: initUsers.data.users,
          visibleUsers: initUsers.data.users,
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
        socket.on('new user', (users) => {
          // console.log(users);
          // const { users, userId } = data;
          // console.log('sock');
          console.log(users);
          // console.log(userId);
          // if (userId !== this.state.userId) {
          //   this.setState({ users: users.filter(user => +user.userId !== this.state.userId) });
          // }
          this.setState(users);
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
    console.log(value);
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { message, selectedChannel, userName } = this.state;
    const messageDate = new Date();
    // this.setState({ message: '' });
    // socket.emit('new message', { channelId: selectedChannel, message });
    // axios.post(`${baseUrl}/newMessage`, { channelId: selectedChannel, message })
    axios.post(`${baseUrl}/newMessage`, {
      channelId: selectedChannel,
      message,
      userName,
      messageDate,
    })
      .then(() => {
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
    // console.log(channelsMessages);
    const visibleMessages = channelsMessages[id];
    this.setState({ visibleMessages, selectedChannel: id });
  }

  handleSelectUser = (id) => () => {
    // const { channelsMessages } = this.state;
    // console.log(channelsMessages);
    // const visibleMessages = channelsMessages[id];
    // this.setState({ visibleMessages, selectedChannel: id });
    this.setState({ selectedUser: id });
  }

  handleDeleteChannel = (id) => () => {
    axios.post(`${baseUrl}/deleteChannel`, {
      channelId: id,
    })
      .then(() => {
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
      .then(() => {
        // console.log('here');
        // socket.emit('new channel', newChannelName);
        console.log('here');
        this.setState({ newChannelName: '', showModal: false });
      })
      .catch((error) => {
        throw error;
      });

    // socket.emit('new channel', newChannelName);
    // this.setState({ newChannelName: '', showModal: false });
  }

  handleAddUser = (e) => {
    e.preventDefault();
    const { userName, users } = this.state;
    axios.post(`${baseUrl}/addUser`, { userName })
      .then((resp) => {
        // console.log('here');
        // socket.emit('new channel', newChannelName);
        
        const userId = resp.data;
        console.log('resp');
        console.log(userId);

        this.setState({ registered: true, userId });
        const visibleUsers = users.filter(user => +user.id !== userId);
        this.setState({ visibleUsers });
        sessionStorage.setItem('registered', true);
        sessionStorage.setItem('userId', resp.data);
        sessionStorage.setItem('userName', userName);
      })
      .catch((error) => {
        throw error;
      });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleShowModal = () => {
    this.setState({ showModal: true });
  }

  render() {
    const {
      visibleMessages, message, requestState, channels, selectedChannel, showModal,
      newChannelName, registered, userName, users, selectedUser, userId, visibleUsers,
    } = this.state;

    console.log(userName);

    if (!registered) {
      return (
        <RegisterModal onFormChange={this.handleChange}
          onFormSubmit={this.handleAddUser}
          userName={userName}
          onHide={this.handleCloseModal}
        />
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
                    <Channels channels={channels}
                      selectedChannel={selectedChannel}
                      selectChannel={this.handleSelectChannels}
                    />
                    <ListGroup.Item><Button variant="primary" type="submit" block onClick={this.handleShowModal}>Add channel</Button></ListGroup.Item>
                    <MyModal show={showModal} onFormChange={this.handleChange}
                     onFormSubmit={this.handleAddChannel} newChannelName={newChannelName}
                     onHide={this.handleCloseModal}
                    />
                  </ListGroup>
                  <Users users={visibleUsers}
                      selectedUser={selectedUser}
                      selectUser={this.handleSelectUser}
                  />
                  {/* {userName}{userId} */}
                </Col>
                <Col xs={2} md={1}>
                  <DeleteChannels channels={channels} deleteChannel={this.handleDeleteChannel} />
                </Col>
                <Col xs={12} md={8}>
                  <Messages visibleMessages={visibleMessages} />
                  <MessageForm message={message}
                   submitMessage={this.handleSubmit} writeMessage={this.handleChange} />
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

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Spinner,
  Alert,
  ListGroup,
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
} from 'react-bootstrap';
import MyModal from './MyModal.jsx';
import RegisterModal from './RegisterModal.jsx';
import Channels from './Channels.jsx';
import DeleteChannels from './DeleteChannels.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import Users from './Users.jsx';

const socket = io('http://localhost:8080');
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
      visibleChannels: [],
      channelsMessages: [],
      users: [],
      visibleUsers: [],
      selectedUser: '',
      visibleMessages: [],
      selectedChannel: '',
      message: '',
      showModal: false,
      // userName: sessionStorage.getItem('user'),
      userName: sessionStorage.getItem('userName') || '',
      userId: sessionStorage.getItem('userId') || null,
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
        // const initCannels = await axios.get(`${baseUrl}/channels`);
        const initCannels = await axios.get(`${baseUrl}/channels?userId=${this.state.userId}`);
        // console.log(initCannels);
        const initUsers = await axios.get(`${baseUrl}/users?userId=${this.state.userId}`);
        const initMessages = await axios.get(`${baseUrl}/channelsMessages`);
        this.setState({
          requestState: 'success',
          users: initUsers.data.users,
          visibleUsers: initUsers.data.users,
          channels: initCannels.data,
          visibleChannels: initCannels.data,
          channelsMessages: initMessages.data,
          // selectedChannel: initCannels.data[0].id,
          // visibleMessages: initMessages.data[initCannels.data[0].id],
        });
        socket.on('new message', (messages) => {
          const { selectedChannel } = this.state;
          const visibleMessages = messages[selectedChannel];
          this.setState({ channelsMessages: messages, visibleMessages });
        });
        socket.on('new channel', (data) => {
          const { channels, channelsMessages, newChannel } = data;
          // console.log(data);
          const { visibleChannels } = this.state;
          visibleChannels.push(newChannel);
          this.setState({ channels, channelsMessages, visibleChannels });
          // this.setState({ channels: data.channels, channelsMessages: data.channelsMessages });
        });
        socket.on('new user', (data) => {
          // const { users, userId } = data;
          const { users } = data;
          this.setState({ users });
          if (this.state.userId !== null) {
            console.log('socket');
            console.log(this.state.userId);
            console.log(typeof this.state.userId);
            console.log(users);

            const visibleUsers = users.filter((user) => user.id !== this.state.userId);
            this.setState({ visibleUsers });
          }
          // const visibleUsers = users.filter((user) => user.id !== this.state.userId);
          // this.setState({ visibleUsers });
        });
        socket.on('new user channel', (data) => {
          const { channels, channelsMessages, currentUserId, newUserId, currentUserChannels, otherUserChannels } = data;
          this.setState({ channels, channelsMessages });
          // console.log(currentUserId);
          // console.log(this.state.userId);

          if (this.state.userId === currentUserId) {
            const visibleUsers = this.state.visibleUsers.filter((user) => (user.id !== currentUserId) && (user.id !== newUserId));
            const visibleChannels = channels.filter((channel) => currentUserChannels.some(id => id === channel.id));
            this.setState({ visibleUsers, visibleChannels });
          }
          if (this.state.userId === newUserId) {
            const visibleUsers = this.state.visibleUsers.filter((user) => (user.id !== currentUserId) && (user.id !== newUserId));
            const visibleChannels = channels.filter((channel) => otherUserChannels.some(id => id === channel.id));
            this.setState({ visibleUsers, visibleChannels });
          }
        });
        socket.on('delete channel', (data) => {
          const { channels, channelsMessages, channelId } = data;
          const { visibleChannels } = this.state;
          const newVisibleChannels = visibleChannels.filter((channel) => channel.id !== channelId);
          this.setState({ channels, channelsMessages, visibleChannels: newVisibleChannels });
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
    this.setState({ visibleMessages, selectedUser: '', selectedChannel: id });
    // this.setState({ visibleMessages, selectedChannel: id });
  }

  handleSelectUser = (id) => () => {
    // console.log(id);
    // this.setState({ visibleMessages, selectedUser: '' });
    // this.setState({ visibleMessages, selectedChannel: id });
    // this.setState({ selectedUser: id });
    this.setState({ selectedChannel: '', selectedUser: id });
  }

  handleDeleteChannel = (id) => () => {
    axios.post(`${baseUrl}/deleteChannel`, {
      channelId: id,
    })
      .then(() => {
        // const { channels } = this.state;
      })
      .catch((error) => {
        throw error;
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
    const { users, userName } = this.state;
    axios.post(`${baseUrl}/addUser`, { userName })
      .then((resp) => {
        console.log('resp');
        const userId = resp.data.toString();
        console.log(userId);
        console.log(users);
        const visibleUsers = users.filter((user) => user.id !== userId);
        this.setState({
          registered: true,
          userId,
          userName,
          visibleUsers,
        });
        sessionStorage.setItem('registered', true);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userName', userName);
      })
      .catch((error) => {
        throw error;
      });
  }

  handleCreateChannelWithUser = (id) => (e) => {
    e.preventDefault();
    const { userId } = this.state;
    // console.log(userId);
    // console.log(id);

    axios.post(`${baseUrl}/addUserChannel`, {
      currentUserId: userId,
      newUserId: id,
    })
      .then(() => {
      // console.log('here');
      // socket.emit('new channel', newChannelName);
      // console.log('here');
      // this.setState({ newChannelName: '', showModal: false });
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
      visibleMessages, message, requestState, selectedChannel, showModal,
      newChannelName, registered, userName, selectedUser, userId, visibleUsers, visibleChannels,
    } = this.state;

    console.log(userId);

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
          <Jumbotron>
             <h1 align='center'>CHATIK</h1>
          </Jumbotron>
          <Container>
              <Row>
                <Col xs={10} md={4}>
                  <ListGroup variant="flush">
                    <Channels channels={visibleChannels}
                      selectedChannel={selectedChannel}
                      selectChannel={this.handleSelectChannels}
                    />
                    <ListGroup.Item>
                      <Button variant="outline-info" type="submit" block onClick={this.handleShowModal}>Add channel</Button>
                     </ListGroup.Item>
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
                  <DeleteChannels channels={visibleChannels} deleteChannel={this.handleDeleteChannel} />
                </Col>
                <Col xs={12} md={7}>
                  {(selectedChannel !== '')
                    ? (
                    <>
                      <Messages visibleMessages={visibleMessages} />
                      <MessageForm message={message}
                      submitMessage={this.handleSubmit} writeMessage={this.handleChange} />
                    </>
                    ) : null
                  }
                  {(selectedUser !== '')
                    ? (
                      <Button variant="primary" type="submit" block onClick={this.handleCreateChannelWithUser(selectedUser)}>Create Channel with this user</Button>
                    ) : null
                  }
                  {/* <Messages visibleMessages={visibleMessages} />
                  <MessageForm message={message}
                   submitMessage={this.handleSubmit} writeMessage={this.handleChange} /> */}
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

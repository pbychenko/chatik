import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import _ from 'lodash';
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

const baseUrl = 'http://localhost:8080';
const socket = io(baseUrl);

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
      users: [],
      selectedUser: '',
      visibleMessages: [],
      selectedChannel: '',
      message: '',
      showModal: false,
      userName: sessionStorage.getItem('userName') || '',
      userId: sessionStorage.getItem('userId') || null,
      newChannelName: '',
      requestState: '',
      showErrorBlock: false,
    };
  }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        const initCannels = await axios.get(`${baseUrl}/channels/${this.state.userId}`);
        const initUsers = await axios.get(`${baseUrl}/users/${this.state.userId}`);
        const initMessages = await axios.get(`${baseUrl}/channels/${this.state.userId}/messages`);
        this.setState({
          requestState: 'success',
          users: initUsers.data.users,
          channels: initCannels.data,
          messages: initMessages.data,
        });
        socket.on('new message', (data) => {
          const { messages, selectedChannel, channels } = this.state;
          const { channelId, newMessage } = data;
          if (_.findIndex(channels, (o) => o.id === channelId) !== -1) {
            messages[channelId].push(newMessage);
            const visibleMessages = messages[selectedChannel];
            this.setState({ messages, visibleMessages });
          }
        });
        socket.on('new channel', (data) => {
          const { channels } = this.state;
          const { newChannel } = data;
          channels.push(newChannel);
          this.setState({ channels });
        });
        socket.on('new user', (newUser) => {
          const { users, userId } = this.state;
          if (userId === null || userId !== newUser.id) {
            users.push(newUser);
            this.setState({ users });
          }
        });
        socket.on('new user channel', (data) => {
          const { users, channels, messages } = this.state;
          const { currentUserId, otherUserId, newChannel } = data;
          if (this.state.userId === currentUserId || this.state.userId === otherUserId) {
            const newUsers = users.filter((user) => (user.id !== currentUserId) && (user.id !== otherUserId));
            channels.push(newChannel);
            messages[newChannel.id] = [];
            this.setState({ users: newUsers, channels, messages });
          }
        });
        socket.on('delete channel', (data) => {
          const { channels, messages } = this.state;
          const { channelId } = data;
          const newChannels = channels.filter((channel) => channel.id !== channelId);
          delete messages[channelId];
          this.setState({ channels: newChannels, messages });
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
    axios.post(`${baseUrl}/channels/message`, {
      channelId: selectedChannel,
      message,
      userName,
      messageDate,
    })
      .then(() => {
        this.setState({ message: '' });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSelectChannel = (id) => () => {
    const { messages } = this.state;
    const visibleMessages = messages[id];
    this.setState({ visibleMessages, selectedUser: '', selectedChannel: id });
  }

  handleSelectUser = (id) => () => {
    this.setState({ selectedChannel: '', selectedUser: id });
  }

  handleDeleteChannel = (id) => () => {
    axios.delete(`${baseUrl}/channels/${id}`, {
      channelId: id,
    })
      .then(() => {
        // const { channels } = this.state;
      })
      .catch((error) => {
        throw error;
      });
  }

  handleAddChannel = (e) => {
    e.preventDefault();
    const { newChannelName } = this.state;
    axios.post(`${baseUrl}/channels/add`, {
      channelName: newChannelName,
    })
      .then(() => {
        this.setState({ newChannelName: '', showModal: false });
      })
      .catch((error) => {
        throw error;
      });
  }

  handleAddUser = (e) => {
    e.preventDefault();
    const { users, userName } = this.state;
    axios.post(`${baseUrl}/users/add`, { userName })
      .then((resp) => {
        // console.log('resp');
        const userId = resp.data.toString();
        const newVisibleUsers = users.filter((user) => user.id !== userId);
        this.setState({
          registered: true,
          userId,
          userName,
          users: newVisibleUsers,
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

    axios.post(`${baseUrl}/channels/addPrivate`, {
      currentUserId: userId,
      otherUserId: id,
    })
      .then(() => {
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
      newChannelName, registered, userName, selectedUser, users, channels,
    } = this.state;

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
                    <Channels channels={channels}
                      selectedChannel={selectedChannel}
                      selectChannel={this.handleSelectChannel}
                    />
                    <ListGroup.Item>
                      <Button variant="outline-info" type="submit" block onClick={this.handleShowModal}>Add channel</Button>
                     </ListGroup.Item>
                    <MyModal show={showModal} onFormChange={this.handleChange}
                     onFormSubmit={this.handleAddChannel} newChannelName={newChannelName}
                     onHide={this.handleCloseModal}
                    />
                  </ListGroup>
                  <Users users={users}
                      selectedUser={selectedUser}
                      selectUser={this.handleSelectUser}
                  />
                </Col>
                <Col xs={2} md={1}>
                  <DeleteChannels channels={channels} deleteChannel={this.handleDeleteChannel} />
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

// import React from 'react';
import React, { useState, useEffect } from 'react';
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

const App = () => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     registered: sessionStorage.getItem('registered'),
  //     channels: [],
  //     channelsMessages: [],
  //     users: [],
  //     selectedUser: '',
  //     visibleMessages: [],
  //     selectedChannel: '',
  //     message: '',
  //     showModal: false,
  //     userName: sessionStorage.getItem('userName') || '',
  //     userId: sessionStorage.getItem('userId') || null,
  //     newChannelName: '',
  //     requestState: '',
  //     showErrorBlock: false,
  //   };
  // }
  const [registered, setRegistered] = useState(sessionStorage.getItem('registered'));
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || null);
  const [newChannelName, setNewChannelName] = useState('');
  const [requestState, setRequestState] = useState('');
  // const [socket, setSocket] = useState(null);
  // const [showErrorBlock, setShowErrorBlock] = useState(false);


  // componentDidMount() {
  // useEffect(() => {
  //   this.setState({ requestState: 'processing' }, async () => {
  //     try {
  //       const initCannels = await axios.get(`${baseUrl}/channels/${this.state.userId}`);
  //       const initUsers = await axios.get(`${baseUrl}/users/${this.state.userId}`);
  //       const initMessages = await axios.get(`${baseUrl}/channels/${this.state.userId}/messages`);
  //       // this.setState({
  //       //   requestState: 'success',
  //       //   users: initUsers.data.users,
  //       //   channels: initCannels.data,
  //       //   messages: initMessages.data,
  //       // });
  //       setRequestState('success');
  //       setUsers(initUsers.data.users);
  //       setChannels(initCannels.data);
  //       setMessages(initMessages.data);

  //       socket.on('new message', (data) => {
  //         // const { messages, selectedChannel, channels } = this.state;
  //         const { channelId, newMessage } = data;
  //         if (_.findIndex(channels, (o) => o.id === channelId) !== -1) {
  //           messages[channelId].push(newMessage);
  //           const visibleMessages = messages[selectedChannel];
  //           // this.setState({ messages, visibleMessages });
  //           setMessages(messages);
  //           setVisibleMessages(visibleMessages);
  //         }
  //       });
  //       socket.on('new channel', (data) => {
  //         // const { channels } = this.state;
  //         const { newChannel } = data;
  //         channels.push(newChannel);
  //         // this.setState({ channels });
  //         setChannels(channels);
  //       });
  //       socket.on('new user', (newUser) => {
  //         // const { users, userId } = this.state;
  //         if (userId === null || userId !== newUser.id) {
  //           users.push(newUser);
  //           // this.setState({ users });
  //           setUsers(users);
  //         }
  //       });
  //       socket.on('new user channel', (data) => {
  //         // const { users, channels, messages } = this.state;
  //         const { currentUserId, otherUserId, newChannel } = data;
  //         // if (this.state.userId === currentUserId || this.state.userId === otherUserId) {
  //         if (userId === currentUserId || userId === otherUserId) {  
  //           const newUsers = users.filter((user) => (user.id !== currentUserId) && (user.id !== otherUserId));
  //           channels.push(newChannel);
  //           messages[newChannel.id] = [];
  //           // this.setState({ users: newUsers, channels, messages });
  //           setUsers(users);
  //           setChannels(channels);
  //           setMessages(messages);
  //         }
  //       });
  //       socket.on('delete channel', (data) => {
  //         // const { channels, messages } = this.state;
  //         const { channelId } = data;
  //         const newChannels = channels.filter((channel) => channel.id !== channelId);
  //         delete messages[channelId];
  //         // this.setState({ channels: newChannels, messages });
  //         setChannels(channels);
  //         setMessages(messages);
  //       });
  //     } catch (error) {
  //       // this.setState({ requestState: 'failed' });
  //       setRequestState('failed')
  //       throw error;
  //     }
  //   });
  // };
  // useEffect(() => {
  //   setSocket(io(baseUrl));
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setRequestState('processing');
      try {
        const initCannels = await axios.get(`${baseUrl}/channels/${userId}`);
        setRequestState('success');
        setChannels(initCannels.data);
      } catch (error) {
        setRequestState('failed');
        throw error;
      }
    };
    fetchData();
  }, [userId, messages]);

  useEffect(() => {
    const fetchData = async () => {
      setRequestState('processing');
      try {
        const initUsers = await axios.get(`${baseUrl}/users/${userId}`);
        setRequestState('success');
        setUsers(initUsers.data.users);
      } catch (error) {
        setRequestState('failed');
        throw error;
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setRequestState('processing');
      try {
        const initMessages = await axios.get(`${baseUrl}/channels/${userId}/messages`);
        setRequestState('success');
        setMessages(initMessages.data);
      } catch (error) {
        setRequestState('failed');
        throw error;
      }
    };
    fetchData();
  }, [userId]);
  socket.connect();
  useEffect(() => {
    // socket.connect();
    // setSocket(io(baseUrl));
    // setRequestState('processing');
    try {
      socket.on('new message', (data) => {
        const { channelId, newMessage } = data;
        // console.log(data);
        if (_.findIndex(channels, (o) => o.id === channelId) !== -1) {
          messages[channelId].push(newMessage);
          const newVisibleMessages = messages[selectedChannel];
          // this.setState({ messages, visibleMessages });
          setMessages([...messages]);
          setVisibleMessages([...newVisibleMessages]);
        }
      });
      socket.on('new channel', (data) => {
        // const { channels } = this.state;
        console.log(channels);
        console.log('here');
        const { newChannel } = data;
        channels.push(newChannel);
        // this.setState({ channels });
        setChannels([...channels]);
      });
      socket.on('new user', (newUser) => {
        // const { users, userId } = this.state;
        if (userId === null || userId !== newUser.id) {
          users.push(newUser);
          // this.setState({ users });
          setUsers(users);
        }
      });
      socket.on('new user channel', (data) => {
        // const { users, channels, messages } = this.state;
        const { currentUserId, otherUserId, newChannel } = data;
        // if (this.state.userId === currentUserId || this.state.userId === otherUserId) {
        if (userId === currentUserId || userId === otherUserId) {
          const newUsers = users.filter((user) => (user.id !== currentUserId) && (user.id !== otherUserId));
          channels.push(newChannel);
          messages[newChannel.id] = [];
          // this.setState({ users: newUsers, channels, messages });
          setUsers(newUsers);
          setChannels(channels);
          setMessages(messages);
        }
      });
      socket.on('delete channel', (data) => {
        // const { channels, messages } = this.state;
        const { channelId } = data;
        const newChannels = channels.filter((channel) => channel.id !== channelId);
        delete messages[channelId];
        // this.setState({ channels: newChannels, messages });
        setChannels(newChannels);
        setMessages(messages);
      });
    } catch (error) {
      setRequestState('failed');
      throw error;
    }
    // fetchData();
  }, [channels]);

  // useEffect(() => {
  //   // setRequestState('processing');
  //   const fetchData = async () => {
  //     setRequestState('processing');
  //     try {
  //       // const initCannels = await axios.get(`${baseUrl}/channels/${userId}`);
  //       const initUsers = await axios.get(`${baseUrl}/users/${userId}`);
  //       const initMessages = await axios.get(`${baseUrl}/channels/${userId}/messages`);
  //       setRequestState('success');
  //       setUsers(initUsers.data.users);
  //       // setChannels(initCannels.data);
  //       setMessages(initMessages.data);
  //       socket.on('new message', (data) => {
  //         // const { messages, selectedChannel, channels } = this.state;
  //         const { channelId, newMessage } = data;
  //         if (_.findIndex(channels, (o) => o.id === channelId) !== -1) {
  //           messages[channelId].push(newMessage);
  //           const newVisibleMessages = messages[selectedChannel];
  //           // this.setState({ messages, visibleMessages });
  //           setMessages(messages);
  //           setVisibleMessages(newVisibleMessages);
  //         }
  //       });
  //       socket.on('new channel', (data) => {
  //         // const { channels } = this.state;
  //         const { newChannel } = data;
  //         channels.push(newChannel);
  //         // this.setState({ channels });
  //         setChannels(channels);
  //       });
  //       socket.on('new user', (newUser) => {
  //         // const { users, userId } = this.state;
  //         if (userId === null || userId !== newUser.id) {
  //           users.push(newUser);
  //           // this.setState({ users });
  //           setUsers(users);
  //         }
  //       });
  //       socket.on('new user channel', (data) => {
  //         // const { users, channels, messages } = this.state;
  //         const { currentUserId, otherUserId, newChannel } = data;
  //         // if (this.state.userId === currentUserId || this.state.userId === otherUserId) {
  //         if (userId === currentUserId || userId === otherUserId) {
  //           const newUsers = users.filter((user) => (user.id !== currentUserId) && (user.id !== otherUserId));
  //           channels.push(newChannel);
  //           messages[newChannel.id] = [];
  //           // this.setState({ users: newUsers, channels, messages });
  //           setUsers(newUsers);
  //           setChannels(channels);
  //           setMessages(messages);
  //         }
  //       });
  //       socket.on('delete channel', (data) => {
  //         // const { channels, messages } = this.state;
  //         const { channelId } = data;
  //         const newChannels = channels.filter((channel) => channel.id !== channelId);
  //         delete messages[channelId];
  //         // this.setState({ channels: newChannels, messages });
  //         setChannels(newChannels);
  //         setMessages(messages);
  //       });
  //     } catch (error) {
  //       setRequestState('failed');
  //       throw error;
  //     }
  //   };
  //   fetchData();
  //   return () => socket.disconnect();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const map = {
      message: setMessage,
      newChannelName: setNewChannelName,
      userName: setUserName,
    };
    // this.setState({ [name]: value });
    map[name](value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const { message, selectedChannel, userName } = this.state;
    const messageDate = new Date();
    axios.post(`${baseUrl}/channels/message`, {
      channelId: selectedChannel,
      message,
      userName,
      messageDate,
    })
      .then(() => {
        // this.setState({ message: '' });
        setMessage('');
      })
      .catch((error) => {
        throw error;
      });
  };

  const handleSelectChannel = (id) => () => {
    // const { messages } = this.state;
    const newVisibleMessages = messages[id];
    // this.setState({ visibleMessages, selectedUser: '', selectedChannel: id });
    setVisibleMessages(newVisibleMessages);
    setSelectedUser('');
    setSelectedChannel(id);
  };

  const handleSelectUser = (id) => () => {
    // this.setState({ selectedChannel: '', selectedUser: id });
    setSelectedChannel('');
    setSelectedUser(id);
  };

  const handleDeleteChannel = (id) => () => {
    axios.delete(`${baseUrl}/channels/${id}`, {
      channelId: id,
    })
      .then(() => {
        // const { channels } = this.state;
      })
      .catch((error) => {
        throw error;
      });
  };

  const handleAddChannel = (e) => {
    e.preventDefault();
    // const { newChannelName } = this.state;
    axios.post(`${baseUrl}/channels/add`, {
      channelName: newChannelName,
    })
      .then(() => {
        // this.setState({ newChannelName: '', showModal: false });
        setNewChannelName('');
        setShowModal(false);
      })
      .catch((error) => {
        throw error;
      });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    // const { users, userName } = this.state;
    axios.post(`${baseUrl}/users/add`, { userName })
      .then((resp) => {
        // console.log('resp');
        const newUserId = resp.data.toString();
        const newVisibleUsers = users.filter((user) => user.id !== newUserId);
        // this.setState({
        //   registered: true,
        //   userId,
        //   userName,
        //   users: newVisibleUsers,
        // });
        setRegistered(true);
        setUserId(newUserId);
        setUserName(userName);
        setUsers(newVisibleUsers);
        sessionStorage.setItem('registered', true);
        sessionStorage.setItem('userId', newUserId);
        sessionStorage.setItem('userName', userName);
      })
      .catch((error) => {
        throw error;
      });
  };

  const handleCreateChannelWithUser = (id) => (e) => {
    e.preventDefault();
    // const { userId } = this.state;

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
  };

  const handleCloseModal = () => {
    // this.setState({ showModal: false });
    setShowModal(false);
  };

  const handleShowModal = () => {
    // this.setState({ showModal: true });
    setShowModal(true);
  };
  // console.log(channels);

  // render() {
  //   const {
  //     visibleMessages, message, requestState, selectedChannel, showModal,
  //     newChannelName, registered, userName, selectedUser, users, channels,
  //   } = this.state;

  if (!registered) {
    return (
      // <RegisterModal onFormChange={this.handleChange}
      <RegisterModal onFormChange={handleChange}
        onFormSubmit={handleAddUser}
        userName={userName}
        // onHide={this.handleCloseModal}
        onHide={handleCloseModal}
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
                    // selectChannel={this.handleSelectChannel}
                    selectChannel={handleSelectChannel}
                  />
                  <ListGroup.Item>
                    {/* <Button variant="outline-info" type="submit" block onClick={this.handleShowModal}>Add channel</Button> */}
                    <Button variant="outline-info" type="submit" block onClick={handleShowModal}>Add channel</Button>
                    </ListGroup.Item>
                  {/* <MyModal show={showModal} onFormChange={this.handleChange}
                    onFormSubmit={this.handleAddChannel} newChannelName={newChannelName}
                    onHide={this.handleCloseModal}
                  /> */}
                  <MyModal show={showModal} onFormChange={handleChange}
                    onFormSubmit={handleAddChannel} newChannelName={newChannelName}
                    onHide={handleCloseModal}
                  />
                </ListGroup>
                <Users users={users}
                    selectedUser={selectedUser}
                    // selectUser={this.handleSelectUser}
                    selectUser={handleSelectUser}
                />
              </Col>
              <Col xs={2} md={1}>
                {/* <DeleteChannels channels={channels} deleteChannel={this.handleDeleteChannel} /> */}
                <DeleteChannels channels={channels} deleteChannel={handleDeleteChannel} />
              </Col>
              <Col xs={12} md={7}>
                {(selectedChannel !== '')
                  ? (
                  <>
                    <Messages visibleMessages={visibleMessages} />
                    <MessageForm message={message}
                    // submitMessage={this.handleSubmit} writeMessage={this.handleChange} />
                      submitMessage={handleSubmit} writeMessage={handleChange} />
                  </>
                  ) : null
                }
                {(selectedUser !== '')
                  ? (
                    // <Button variant="primary" type="submit" block onClick={this.handleCreateChannelWithUser(selectedUser)}>Create Channel with this user</Button>
                    <Button variant="primary" type="submit" block onClick={handleCreateChannelWithUser(selectedUser)}>Create Channel with this user</Button>
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
};

export default App;

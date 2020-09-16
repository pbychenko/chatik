import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import openSocket from 'socket.io-client';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';

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
        // const messages = 
        
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
    // console.log('test');
  }

  render() {
    const { messages, message, requestState } = this.state;
    // console.log('fd');
    // console.log(messages);

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
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" name="message" onChange={this.handleChange} value={message} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" width="100%">Send</button>
          </form>
          {messages.map(message => (<p>{message}</p>))}
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

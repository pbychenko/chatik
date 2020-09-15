import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import openSocket from 'socket.io-client';
import axios from 'axios';

const socket = openSocket('http://localhost:8080');
const baseUrl = 'http://localhost:8080';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: '',
      requestState: '',
    };
  }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        const messages = await axios.get(`${baseUrl}/messages`);
        
        this.setState({
          requestState: 'success',
          messages,
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
    this.setState({ messages, message: '' });
    socket.emit('testCon', message);
    socket.on('testCon1', (data) => {
      console.log(data);
    });
    // console.log('test');
  }

  render() {
    const { messages, message } = this.state;
    console.log('fd');
    console.log(messages);
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
}

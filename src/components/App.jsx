import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8080');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: '',
    };
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
    socket.emit('chat message', message);    
  }

  render() {
    const { messages, message } = this.state;
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

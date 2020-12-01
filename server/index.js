const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const users = require('./routes/users');
const channels = require('./routes/channels');

// app.set('view engine', 'pug');
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '/dist/public')));
app.use(bodyParser.json());
const port = '8080';  

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user has disconnected');
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/users', users(io));
app.use('/channels', channels(io));

http.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});

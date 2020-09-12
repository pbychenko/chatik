import Express from 'express';
import path from 'path';
// import path from 'path';

const app = new Express();
const port = 3000;

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var port = process.env.PORT || 8080;

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

app.get('/', (req, res) => {
  const __dirname = path.resolve();
  console.log(`${__dirname}`);
  res.sendFile(path.resolve(`${__dirname}/template.html`));
});

app.listen(port, () => {
  const __dirname = path.resolve();
  console.log(path.resolve(`${__dirname}/../template.html`));
  console.log('listening on *:3000');
});

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const { generateMessage, locationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const Filter = require('bad-words');

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  // console.log('New web socket connection');
  // socket.emit('countUpdated', count);
  // socket.on('increment', () => {
  //   count = count + 1;
  //   // socket.emit('countUpdated', count); // emits data to this single connection that is connected to the server
  //   io.emit('countUpdated', count); // emits data to all connections available to that server
  // });

  // socket.emit('message', generateMessage('Welcome!'));
  // socket.broadcast.emit('message', generateMessage('A new user has joined')); // emits data to all connections available to that server except the current user

  //listener for join action from client
  socket.on('join', ({ username, roomname }) => {
    socket.join(roomname);
    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast
      .to(roomname)
      .emit('message', generateMessage(`${username}' has joined!`));
  });
  // listener for send message action from client
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }
    io.emit('message', generateMessage(message));
    callback(); // this is going to acknowledge the client that the server has received the message
  });
  // executed when a user disconnects from the server
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  });
  // listens for sendLocation event and broadcasts that location to the other users connected to this server
  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'locationMessage',
      locationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

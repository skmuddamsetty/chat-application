const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.log('New web socket connection');
  // socket.emit('countUpdated', count);
  // socket.on('increment', () => {
  //   count = count + 1;
  //   // socket.emit('countUpdated', count); // emits data to this single connection that is connected to the server
  //   io.emit('countUpdated', count); // emits data to all connections available to that server
  // });

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined'); // emits data to all connections available to that server except the current user
  socket.on('sendMessage', message => {
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

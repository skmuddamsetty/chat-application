const socket = io();
// socket.on('countUpdated', count => {
//   console.log('The count has been updated', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked');
//   socket.emit('increment'); // updating the server that an event happened
// });

socket.on('message', message => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('sendMessage', document.querySelector('input').value);
});

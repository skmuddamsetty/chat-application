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
  // const message = document.querySelector('input').value;
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message);
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  });
});

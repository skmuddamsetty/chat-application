const socket = io();
// socket.on('countUpdated', count => {
//   console.log('The count has been updated', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked');
//   socket.emit('increment'); // updating the server that an event happened
// });

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', message => {
  console.log(message);
});

$messageForm.addEventListener('submit', e => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');
  // const message = document.querySelector('input').value;
  const message = e.target.elements.message.value;
  // emits the message that the user has typed in the textbox
  // third param i.e., a callback that will be executed when the server responds with this event
  socket.emit('sendMessage', message, error => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log('the message was delivered');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  $sendLocationButton.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        console.log('Location shared successfully!');
        $sendLocationButton.removeAttribute('disabled');
      }
    );
  });
});

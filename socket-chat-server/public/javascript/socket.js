
document.addEventListener('DOMContentLoaded', (event) => {
  document.addEventListener('click', e => {
    console.log('asdfasfasasdfas')
  })
  const socket = io();
  const form = document.getElementsByTagName('form');
  const msg = document.getElementById('m');
  console.log({ form });
  if(form) {
    form.submit(function(e){
      e.preventDefault();
      socket.emit('chat message', msg.value());
      console.log('that is it')
    });
  } else {
    console.log('cannot find form element on the page!!')
  }
})
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const fs = require('fs');

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  fs.writeFileSync
  res.sendFile('/public/templates/index.pug');
  socket.emit('news', { hello: 'world' });
});

io.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

socket.on('UPDATE_POT', state => {
  socket.broadcast.emit('UPDATED_POT', { state: 'pot is updated!' });
});
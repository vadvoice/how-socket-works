const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const port = 3001;

app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  io.emit('UPDATE_NEWS', { data: 'huge data list' });
  res.write(`APP is rutting on port: ${port}`);
  res.end();
});

// socket stuff
let pot = 0;
let names = [];
let serverNames = [];
io.on('connection', socket => {
  // below we listen if our pot is updated
  // then emit an event to all connected sockets about the update
  socket.on('UPDATE_POT', state => {
    pot = state.pot;
    socket.broadcast.emit('UPDATED_POT', state);
  });

  // get the current pot's value and emit it to clients
  socket.on('GET_CURRENT_POT', () => socket.emit('CURRENT_POT', pot));

  // add the newest client to the list of active clients
  // then broadcast that to all connected clienhts 
  socket.on('SEND_NAME_TO_SERVER', name => {
    serverNames = [...serverNames, { socketId: socket.id, name }];
    names = [...names, name];
    socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', names);
    socket.emit('SEND_NAMES_TO_CLIENTS', names);
  });

  // broadcast to everyone if somebody pitched in
  socket.on('SOMEONE_PITCHED_IN', name => {
    socket.broadcast.emit('GUESS_WHO_PITCHED_IN', name);
  });

  // broadcast to everyone if somebody got one
  socket.on('SOMEONE_GOT_ONE', name => {
    socket.broadcast.emit('GUESS_WHO_GOT_ONE', name);
  });

  // this is to make sure that when a client disconnects
  // the client's name will be removed from our server's list of names
  // then broadcast that to everybody connected so their list will be updated
  socket.on('disconnect', () => {
    serverNames = serverNames.filter(data => data.socketId !== socket.id);
    names = serverNames.map(data => data.name);
    socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', names);
    socket.emit('SEND_NAMES_TO_CLIENTS', names);
  });
});

const server = http.listen(port, () => {
  console.log('server is running on port', server.address().port);
});
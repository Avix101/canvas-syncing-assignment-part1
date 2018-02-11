const http = require('http');
const app = require('express')();

// Allows for path resolution, which is required by express
const path = require('path');

const server = http.Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const startTime = new Date().toTimeString();
let clicks = 0;

server.listen(port);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});

const onRequestTime = (socket) => {
  socket.on('requestServerStartTime', () => {
    socket.emit('serverStartTime', { time: startTime });
  });
};

const onAddClicks = (socket) => {
  socket.on('addClicks', (data) => {
    clicks += data.clicks;
    io.sockets.in('room1').emit('updateClicks', { numClicks: clicks });
  });
};

io.on('connection', (socket) => {
  socket.join('room1');
  onRequestTime(socket);
  onAddClicks(socket);
  socket.emit('updateClicks', { numClicks: clicks });
});

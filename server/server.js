const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
    cors: '*'
});

const PORT = process.env.PORT || 8080;

let waitingClients = [];
let activeRooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on("disconnecting", () => {
    socket.rooms.forEach(roomId => {
        io.to(roomId).emit('leave', roomId);
    });
    console.log('Client disconnecting:', socket.id);
    removeClient(socket);
  });

  socket.on('join', () => {
    const partnerSocket = waitingClients.shift();
    if (partnerSocket) {
      const roomId = generateRoomId();
      socket.join(roomId);
      partnerSocket.join(roomId);
      io.to(roomId).emit('roomJoined', roomId);
      activeRooms.set(roomId, partnerSocket.id);
      console.log(`User ${partnerSocket.id} connected User ${socket.id}`)

      // Giving Partner socket because he came first the first turn
      io.to(socket.id).emit('turn', false);
      io.to(partnerSocket.id).emit('turn', true);
    } else {
      waitingClients.push(socket);
      console.log(`User ${socket.id} joined!`)
    }
  });
  socket.on('move', (object) => {
    socket.rooms.forEach(roomId => {
        socket.to(roomId).emit('move_back', object);
    });
  });
  socket.on('win', (object) => {
    socket.rooms.forEach(roomId => {
        socket.to(roomId).emit('opponent_win');
    });
  });
});

function removeClient(socket) {
  const index = waitingClients.indexOf(socket);
  if (index !== -1) {
    waitingClients.splice(index, 1);
  }
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 15);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
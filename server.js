const express = require('express');
const fs = require('fs');
const http = require('http');
const { hostname } = require('os');
const networkInterfaces = require('os').networkInterfaces();

const app = express();

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, { cors: { origin: '*' } });

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    if (roomId !== '1' && roomId !== '2') {
      console.log(`Room ${roomId} is invalid.`);
      return;
    }

    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Notify other peers in the room
    socket.to(roomId).emit('new-peer', socket.id);

    // Handle signaling data
    socket.on('signal', ({ to, from, data }) => {
      io.to(to).emit('signal', { from, data });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      socket.to(roomId).emit('peer-disconnected', socket.id);
    });
  });
});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log('Socket.IO server running at http://localhost:3000');
  console.log("Listening on port 3000");

  // Print all accessible URLs
  Object.values(networkInterfaces).forEach((interfaces) => {
    interfaces.forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`Accessible at: http://${iface.address}:3000`);
      }
    });
  });
});

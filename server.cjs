const express = require('express');
const fs = require('fs');
const http = require('http');
const { hostname } = require('os');
const networkInterfaces = require('os').networkInterfaces();

const app = express();

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, { cors: { origin: '*' } });

app.use(express.static('public'));

function validateRoomId(roomId) {
  const checkPattern = /^(100|[1-9][0-9]?)$/;
  return checkPattern.test(roomId);
}

function update_rooms(data) {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/updateRooms',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };
  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log('Response from rooms_manager:', responseData);
    });
  });
  req.on('error', (error) => {
    console.error('Error sending request to rooms_manager:', error);
  });
  req.write(data);
  req.end();
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    if (!validateRoomId(roomId)) {
      console.log(`Room ${roomId} is invalid.`);
      return;
    }

    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // now we need to send request to the rooms_manager server to update the room status
    // we need to send POST request to http://localhost:4000/updateRooms
    data = JSON.stringify({ "room_id" : roomId, "status" : false });
    update_rooms(data)

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
      // Notify rooms_manager server to update room status
      // send POST request to http://localhost:4000/updateRooms
      data = JSON.stringify({ "room_id" : roomId, "status" : true });
      update_rooms(data);
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

const http = require('http');

let rooms_available = [true, true, true, true, true];
let rooms_count = 5;

function get_room() {
    // Check for available rooms
    // return the first available room number
    for (let i = 0; i < rooms_count; i++) {
        if (rooms_available[i]) {
            return i + 1;
        }
    }
    return -1; // No rooms available
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    if (path === '/Room' && method === 'GET') {
        console.log("got request");
        const room_number = get_room();
        if (room_number === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No rooms available' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ room_number }));
        }
    } else if (path === '/updateRooms' && method === 'POST') {
        // API: POST /updateRooms
        // Signalling servers will send updated room status
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { room_id, status } = JSON.parse(body);
            rooms_available[room_id - 1] = status;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Room status updated' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start the server
server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

/*
API Documentation:

GET /Room
- Description: Get an available room number.
- Response: { "room_number": <number> }
- Example: { "room_number": 1 }
- Error: { "error": "No rooms available" }
- Error Example: { "error": "No rooms available" }
- Note: This endpoint is used to check for available rooms before joining a meeting.

POST /updateRooms
- Description: Update the status of a room (available or not).
- Body: { "room_id": <number>, "status": <boolean> }
- Example: { "room_id": 1, "status": false }
- Response: { "message": "Room status updated" }
- Error: { "error": "Invalid room ID" }
- Error Example: { "error": "Invalid room ID" }
- Note: This endpoint is used by signalling servers to update the availability status of rooms.
*/
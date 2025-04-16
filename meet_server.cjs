const http = require('http');

let room_count = 2;
let meetings = [
    {
        id: 1,
        start_time: '2025-04-17T00:00',
        end_time: '2025-04-17T01:00',
        participants_count: 0,
        room_allocated: -1,
    },
    {
        id: 2,
        start_time: '2025-04-17T00:00',
        end_time: '2025-04-17T01:00',
        participants_count: 0,
        room_allocated: -1,
    },
];

function scheduleMeeting(start_time, end_time) {
    const meeting_id = meetings.length + 1;
    meetings.push({
        id: meeting_id,
        start_time: start_time,
        end_time: end_time,
        participants_count: 0,
        room_allocated: -1,
    });
    return meeting_id;
}

function joinMeetingNow(meeting_id) {
    const meeting = meetings.find(meeting => meeting.id == meeting_id);
    if (meeting && meeting.start_time < new Date().toISOString() && meeting.end_time > new Date().toISOString()) {
        if (meeting.room_allocated == -1) {
            room_count += 1;
            meeting.room_allocated = room_count;
        }
        meeting.participants_count += 1;
        return room_count;
    } else {
        return -1;
    }
}

function clearRooms() {
    for (let i = 0; i < meetings.length; i++) {
        if (new Date(meetings[i].end_time).getTime() < new Date().getTime()) {
            meetings[i].room_allocated = -1;
            meetings[i].participants_count = 0;
            room_count -= 1;
        }
    }
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

    if (path === '/scheduleMeeting' && method === 'POST') {
        // API: POST /scheduleMeeting
        // Body: { "start_time": "2025-04-17T02:00", "end_time": "2025-04-17T03:00" }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { start_time, end_time } = JSON.parse(body);
            const meeting_id = scheduleMeeting(start_time, end_time);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ meeting_id }));
        });
    } else if (path === '/joinMeetingNow' && method === 'POST') {
        // API: POST /joinMeetingNow
        // Body: { "meeting_id": 1 }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { meeting_id } = JSON.parse(body);
            const room_id = joinMeetingNow(meeting_id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ room_id }));
        });
    } else if (path === '/clearRooms' && method === 'POST') {
        // API: POST /clearRooms
        // No body required
        clearRooms();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rooms cleared' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start the server
server.listen(3500, () => {
    console.log('Server is running on http://localhost:3500');
});

/*
API Documentation:
1. POST /scheduleMeeting
   - Description: Schedule a new meeting.
   - Request Body: { "start_time": "<ISO string>", "end_time": "<ISO string>" }
   - Response: { "meeting_id": <number> }

2. POST /joinMeetingNow
   - Description: Join an existing meeting.
   - Request Body: { "meeting_id": <number> }
   - Response: { "room_id": <number> or -1 if failed }

3. POST /clearRooms
   - Description: Clear rooms for meetings that have ended.
   - Request Body: None
   - Response: { "message": "Rooms cleared" }
*/
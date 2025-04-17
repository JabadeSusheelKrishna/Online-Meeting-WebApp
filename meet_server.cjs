const http = require('http');

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
    }
];

function get_meeting_id() {
    // Generates a unique meeting ID
    // for now, only incrementing the last meeting ID
    return meetings.length + 1;
}

function get_a_room() {
    // Allocates a room to a meeting
    // send get request to rooms_manager url : "http://localhost:4000/Room" Method : `GET`
    // return the room number
    return new Promise((resolve, reject) => {
        http.get('http://localhost:4000/Room', (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const room = JSON.parse(data);
                    resolve(room.room_number);
                } catch (error) { reject(error); }
            });
        }).on("error", (err) => { reject(err); });
    });
}

function scheduleMeeting(start_time, end_time) {
    const meeting_id = get_meeting_id();
    meetings.push({
        id: meeting_id,
        start_time: start_time,
        end_time: end_time,
        participants_count: 0,
        room_allocated: -1,
    });
    return meeting_id;
}

async function joinMeetingNow(meeting_id) {
    console.log("Meetings : ", meetings);
    const meeting = meetings.find(meeting => meeting.id == meeting_id);
    if (meeting && meeting.start_time < new Date().toISOString() && meeting.end_time > new Date().toISOString()) {
        if (meeting.room_allocated == -1) {
            // case when room is not allocated
            meeting.room_allocated = await get_a_room();
        }
        // case when room is already allocated
        meeting.participants_count += 1;
        return meeting.room_allocated;
    } else {
        return -1;
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
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { meeting_id } = JSON.parse(body);
            const room_id = await joinMeetingNow(meeting_id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ room_id }));
        });
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
POST /scheduleMeeting
Body: { "start_time": "2025-04-17T02:00", "end_time": "2025-04-17T03:00" }
Response: { "meeting_id": 1 }

POST /joinMeetingNow
Body: { "meeting_id": any meeting_id }
Response: { "room_id": 1 }
*/
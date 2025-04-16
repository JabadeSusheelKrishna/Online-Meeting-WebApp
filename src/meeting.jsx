room_count = 0;

meetings = [
    {
        id: 1,
        start_time: '2025-04-17T00:00',
        end_time: '2025-04-17T01:00',
        participants_count : 0,
        room_allocated : -1,
    },
    {
        id: 2,
        start_time: '2025-04-17T00:00',
        end_time: '2025-04-17T01:00',
        participants_count : 0,
        room_allocated : -1,
    },
];
function scheduleMeeting(start_time, end_time){
    meeting_id = meetings.length + 1;
    meetings.push({
        id: meeting_id,
        start_time: start_time,
        end_time: end_time,
        participants_count : 0,
        room_allocated : -1,
    });
    return meeting_id;
}

function joinMeetingNow(meeting_id){
    meeting = meetings.find(meeting => meeting.id == meeting_id);
    if (meeting && meeting.start_time > new Date().toISOString() && meeting.end_time > new Date().toISOString()) {
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

function clearRooms(){
    for(let i=0; i<meetings.length;i++){
        if(new Date(meetings[i].end_time).getTime() < new Date().getTime()){
            meetings[i].room_allocated = -1;
            meetings[i].participants_count = 0;
            room_count -= 1;
        }
    }
}
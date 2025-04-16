import { useState } from 'react';
import { useAuth } from './authentication';
import Authentication from './authentication';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

async function createMeeting() {
  const start_time = document.getElementsByName('startTime')[0].value;
  const end_time = document.getElementsByName('endTime')[0].value;

  try {
    const response = await fetch('http://localhost:3500/scheduleMeeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ start_time, end_time }),
    });

    if (!response.ok) {
      throw new Error('Failed to create meeting');
    }

    const data = await response.json();
    alert("Meeting Created with ID: " + data.meeting_id);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function joinMeeting() {
  const meeting_id = document.getElementsByName('meetingId')[0].value;

  try {
    const response = await fetch('http://localhost:3500/joinMeetingNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meeting_id: parseInt(meeting_id) }),
    });

    if (!response.ok) {
      throw new Error('Failed to join meeting');
    }

    const data = await response.json();
    alert("Joined Meeting with Room Number: " + data.room_id);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function App() {
  const [count, setCount] = useState(0);
  const { isAuthenticated, username } = useAuth();

  if (!isAuthenticated) {
    return <Authentication />;
  }

  return (
    <>
      <h1>Hello {username}, Please select an option below : </h1>
      <div>
        <div>
          <h2>Create a Meeting</h2>
          <form>
            <label>
              Start Time:
              <input type="datetime-local" name="startTime" />
            </label>
            <br />
            <label>
              End Time:
              <input type="datetime-local" name="endTime" />
            </label>
            <br />
            <button type="submit" onClick={createMeeting}>Create Meeting</button>
          </form>
        </div>
        <div>
          <h2>Join a Meeting</h2>
          <form>
            <label>
              Meeting ID:
              <input type="text" name="meetingId" />
            </label>
            <br />
            <button type="submit" onClick={joinMeeting}>Join Meeting</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;

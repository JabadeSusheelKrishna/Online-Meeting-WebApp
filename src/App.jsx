import { useState } from 'react';
import { useAuth } from './authentication';
import Authentication from './authentication';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function App() {
  const [count, setCount] = useState(0);
  const { isAuthenticated, username } = useAuth();
  const navigate = useNavigate();

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
        body: JSON.stringify({ meeting_id }), // Remove parseInt since Firestore IDs are strings
      });

      if (!response.ok) {
        throw new Error('Failed to join meeting');
      }

      const data = await response.json();
      alert("Joined Meeting with Room Number: " + data.room_id);

      // Store room number in cookies
      Cookies.set('roomId', data.room_id);

      // Redirect to Meeting page
      navigate('/meeting');
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  if (!isAuthenticated) {
    return <Authentication />;
  }

  return (
    <>
      <h1>Hello {username}, Please select an option below : </h1>
      <div>
        <div>
          <h2>Create a Meeting</h2>
          <form onSubmit={(e) => { e.preventDefault(); createMeeting(); }}>
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
            <button type="submit">Create Meeting</button>
          </form>
        </div>
        <div>
          <h2>Join a Meeting</h2>
          <form onSubmit={(e) => { e.preventDefault(); joinMeeting(); }}>
            <label>
              Meeting ID:
              <input type="text" name="meetingId" />
            </label>
            <br />
            <button type="submit">Join Meeting</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;

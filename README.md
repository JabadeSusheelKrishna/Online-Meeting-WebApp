# Online Meeting WebApp

A real-time peer-to-peer video conferencing web application built with WebRTC, React, and Node.js. This application allows users to create and join meetings with video and audio capabilities.

## Features

- 🔐 User Authentication with Firebase
- 📹 Real-time Video/Audio Communication
- 🤝 Peer-to-Peer Architecture using WebRTC
- 🔄 Automatic Room Management
- 📅 Meeting Scheduling
- 🎯 Multiple Participant Support
- 👥 Concurrent Meetings handling
- ⏲ with 99.999% server Uptime

## Architecture

The application follows a microservices architecture with the following components:

1. **Frontend** (React + Vite)
   - User interface for meeting interactions
   - WebRTC peer connection management
   - Real-time video/audio streaming

2. **Signaling Server**
   - Manages WebSocket connections
   - Handles WebRTC signaling
   - Facilitates peer discovery and connection

3. **Meeting Server**
   - Manages meeting creation and scheduling
   - Handles participant tracking
   - Integrates with Firebase for data persistence

4. **Room Manager**
   - Controls room allocation
   - Tracks room availability
   - Manages concurrent meeting sessions

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Firebase account and project
- SSL certificates for HTTPS (included in `/ssl` folder for development)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JabadeSusheelKrishna/Online-Meeting-WebApp.git
   cd Online-Meeting-WebApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase 🔥:**
   - Update Firebase configuration in `src/fire_auth.jsx` and `firestore_Database.cjs`
   - Enable Email/Password authentication in Firebase Console
   - Please follow the 🕮 [docs](https://firebase.google.com/docs) for more information about setting up firebase auth.

4. **Start the application:**

   Start all required servers (in separate terminals):

   ```bash
   # Start the frontend development server
   npm run dev

   # Start the signaling server
   npm run signalling

   # Start the meeting server
   npm run meeting

   # Start the room manager server
   npm run room_manager
   ```

## Server Details

- Frontend: Runs on port `5173` (default Vite port)
- Signaling Server: Runs on port `3000`
- Meeting Server: Runs on port `3500`
- Room Manager: Runs on port `4000`
- You can change these ports by changing them in their respective files.

## Usage

1. **Authentication:**
   - Register with email and password
   - Login with existing credentials
   - You also have to provide a username. This will be used for enhancing user experience.

2. **Creating a Meeting:**
   - Click "Create Meeting"
   - Set meeting start and end times
   - Share the generated meeting ID with participants

3. **Joining a Meeting:**
   - Click "Join Meeting"
   - Enter the meeting ID
   - Allow camera and microphone permissions when prompted

## Technical Stack

- **Frontend:**
  - React
  - Vite
  - Socket.IO Client
  - WebRTC APIs

- **Backend:**
  - Node.js
  - Express
  - Socket.IO
  - Firebase Authentication
  - Firestore Database

## API Documentation

### Meeting Server (Port 3500)
- `POST /scheduleMeeting`: Create a new meeting
- `POST /joinMeetingNow`: Join an existing meeting

### Room Manager (Port 4000)
- `GET /Room`: Get an available room
- `POST /updateRooms`: Update room availability status

### Signaling Server (Port 3000)
- WebSocket events for WebRTC signaling
- Handles peer connections and room management

## Security Features

- Firebase Authentication
- Secure WebSocket connections
- HTTPS support (development certificates included)
- Room validation and access control

## Development and Production

### Development
- Uses Vite's development server
- Hot module replacement enabled
- Development SSL certificates provided

### Production
- Build the frontend:
  ```bash
  npm run build
  ```
- Use proper SSL certificates
- Configure proper CORS settings
- Set up proper environment variables

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
6. <i>In Future we are thinking to use CI/CD pipeline for this repository.</i>

## License

[MIT License](LICENSE)

## Acknowledgments

- WebRTC API
- Firebase Team
- React Community
- Socket.IO Team

Made with ❤️ by Team : Event Driven Engineers.
Started with : 
- 👨🏻‍🎓 Jabade Susheel Krishna : [Contact Me](https://github.com/JabadeSusheelKrishna)
- 👩🏻‍🎓 Palle Sreeja : [Contact Me](https://github.com/SreejaP11)
- 👨🏻‍🎓 Srisai Krishna Morampudi : [Contact Me](https://github.com/SrisaiKrishna-2022)
- 👨🏻‍🎓 Venkata Vishnu Sai D : [Contact Me](https://github.com/vishnusaireddy502)
- 👨🏻‍🎓 Ramandeep Singh : [Contact Me](https://github.com/theramandeep04)
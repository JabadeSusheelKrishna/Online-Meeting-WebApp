import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJ3fmH6pTZVRjRdkhbyNh5lMeBedZH4V0",
  authDomain: "online-meeting-3cb69.firebaseapp.com",
  projectId: "online-meeting-3cb69",
  storageBucket: "online-meeting-3cb69.firebasestorage.app",
  messagingSenderId: "480017532396",
  appId: "1:480017532396:web:ceea6b3e90b78c5879acc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;
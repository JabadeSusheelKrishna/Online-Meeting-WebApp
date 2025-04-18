const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDoc, doc, updateDoc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAJ3fmH6pTZVRjRdkhbyNh5lMeBedZH4V0",
    authDomain: "online-meeting-3cb69.firebaseapp.com",
    databaseURL: "https://online-meeting-3cb69-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "online-meeting-3cb69",
    storageBucket: "online-meeting-3cb69.firebasestorage.app",
    messagingSenderId: "480017532396",
    appId: "1:480017532396:web:ceea6b3e90b78c5879acc9"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const collectionName = "meetings";

async function add_Data(data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the Firestore-generated ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function get_Data(meeting_id) {
  try {
    if (!meeting_id || typeof meeting_id !== 'string') {
      console.error("Invalid meeting_id:", meeting_id);
      return null;
    }

    const meetingRef = doc(db, collectionName, meeting_id);
    const meetingSnap = await getDoc(meetingRef);

    if (meetingSnap.exists()) {
      console.log("Document data:", meetingSnap.data());
      return meetingSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
}

async function update_Data(meeting_id, updates) {
  try {
    if (!meeting_id || typeof meeting_id !== 'string') {
      console.error("Invalid meeting_id:", meeting_id);
      throw new Error('Invalid meeting_id');
    }

    const meetingRef = doc(db, collectionName, meeting_id);
    await updateDoc(meetingRef, updates);
    console.log("Document successfully updated!");
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

module.exports = { add_Data, get_Data, update_Data };
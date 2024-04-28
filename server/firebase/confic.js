import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBNGu2-9la20YBIMZnaKUmu66qLOhiD-g",
  authDomain: "mandatory2-15459.firebaseapp.com",
  projectId: "mandatory2-15459",
  storageBucket: "mandatory2-15459.appspot.com",
  messagingSenderId: "856225219834",
  appId: "1:856225219834:web:6d5de60bbce33c5abaf543",
  measurementId: "G-E1K06MHBYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }
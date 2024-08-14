// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6pfDtI5f_VakdQMYwLlXYjfpxy6zeBgI",
  authDomain: "note-app-wap.firebaseapp.com",
  projectId: "note-app-wap",
  storageBucket: "note-app-wap.appspot.com",
  messagingSenderId: "23532205853",
  appId: "1:23532205853:web:a2352de728469192bd53f4",
  measurementId: "G-9HZDZZ1Y5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
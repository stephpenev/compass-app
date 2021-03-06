// firebase.js
import firebase from "firebase/app";
import "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1s1iQDzFwI7MftjQ7Nu62mlUsk7nlk3g",
  authDomain: "compass-app-b2439.firebaseapp.com",
  databaseURL: "https://compass-app-b2439-default-rtdb.firebaseio.com",
  projectId: "compass-app-b2439",
  storageBucket: "compass-app-b2439.appspot.com",
  messagingSenderId: "481941070002",
  appId: "1:481941070002:web:e63da234a814a5ca71e9ab",
};
firebase.initializeApp(firebaseConfig);

export default firebase;
import firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC9wdM3a9Kujt0er_B_mKKA6QKQeNG6d6s",
    authDomain: "socialmap-1485504764773.firebaseapp.com",
    databaseURL: "https://socialmap-1485504764773.firebaseio.com",
    storageBucket: "socialmap-1485504764773.appspot.com",
    messagingSenderId: "403559220940"
};

var Firebase = firebase.initializeApp(firebaseConfig);


module.exports = Firebase;

const firebase = require("firebase");
var config = {
  apiKey: "AIzaSyBLwWyP1YuWZrqvpo_zsNJIyEf8Xi_Lpco",
  authDomain: "gyradosvpn.firebaseapp.com",
  databaseURL: "https://gyradosvpn.firebaseio.com",
  projectId: "gyradosvpn",
  storageBucket: "gyradosvpn.appspot.com",
  messagingSenderId: "50961203679",
  appId: "1:50961203679:web:5889613169c3eeb168c46a",
};
firebase.initializeApp(config);
firebase.database().ref("updateStatus/").set("false");
console.log("done");

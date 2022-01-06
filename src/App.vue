<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
<<<<<<< HEAD
import HelloWorld from './components/HelloWorld.vue'
=======
import AuctioneerPanel from './components/AuctioneerPanel.vue'
import GroupPlayerPanel from './components/GroupPlayersPanel.vue'
import SigninPanel from './components/SigninPanel.vue'
<<<<<<< HEAD
import SignoutPanel from './components/SignoutPanel.vue'
=======
>>>>>>> e27ef58 (commit for heroku)
import PlayerPanel from './components/PlayerPanel.vue'

import axios from 'axios';

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { getMessaging, getToken } from "firebase/messaging";



=======
>>>>>>> 9454283 (commit for heroku)
=======
=======

>>>>>>> 6788a07 (testing rebase)
console.log(process.env.VUE_APP_NAME)

>>>>>>> 22589b4 (working on environment variables)
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}

initializeApp(firebaseConfig);


const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BLI8Ih_57XFC527KdjoPoQnCXDKU8l7jVD15xkINcUN0ZDL6ppg2m1i9TmfC3PAruwjKzZbsm2Ia3L7zBOMOrmU' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
    console.log(currentToken)
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});




// const messaging = getMessaging(firebaseApp)

// messaging.subscribeToTopic('hebajabackup@gmail.com')
//   .then((response) => {
//     // See the MessagingTopicManagementResponse reference documentation
//     // for the contents of response.
//     console.log('Successfully subscribed to topic:', response);
//   })
//   .catch((error) => {
//     console.log('Error subscribing to topic:', error);
//   });
>>>>>>> ee34edc (working on environment variables)

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

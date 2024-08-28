// backend/firebase.js
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDkOf_mHtubyKgcnZT_Qej8KuyUzw3BkRw",
  authDomain: "yourhr-e3348.firebaseapp.com",
  projectId: "yourhr-e3348",
  storageBucket: "yourhr-e3348.appspot.com",
  messagingSenderId: "25431668749",
  appId: "1:25431668749:web:5234056af0c669b9f47d44",
  measurementId: "G-8ZEH634RLD"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

module.exports = { storage, ref, uploadBytes, getDownloadURL };

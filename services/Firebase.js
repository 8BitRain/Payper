/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Firebase.js  💣
  *
  *    Contains all getter, setter, and listener functions for Firebase
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/


// Dependencies
import * as firebase from 'firebase';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwRj_BiJNEvKJC7GQSm9rv9dF_mjIhuzM",
  authDomain: "coincast.firebaseapp.com",
  databaseURL: "https://coincast.firebaseio.com",
  storageBucket: "firebase-coincast.appspot.com",
};
firebase.initializeApp(firebaseConfig);


// Firebase reference points
var usernamesRef = firebase.database().ref('/usernames');


/**
  *   Fetches list of users and returns them via callback function
**/
export function getUsers(callback) {
  usernamesRef.once('value', function(snapshot) {
    if (typeof callback == 'function') callback(snapshot.val());
  }).catch(function(err) {
    console.log("Error code", error.code, "\nError message", error.message);
  });
};


/**
  *   Fetches the specified user's payment flow and stores it in AsyncStorage
**/
export function getPaymentFlow(user, callback) {
  firebase.database().ref('/paymentFlow/' + user.uid).once('value', function(snapshot) {
    if (typeof callback == 'function') callback(snapshot.val());
  });
};


/**
  *   Authenticates user with specified email and password
**/
export function authWithEmail(data, callback) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch((err) => {
    console.log("Error code", err.code, "\nError message", err.message);
    if (typeof callback == 'function') callback(false);
  }).then(() => {
    if (firebase.auth().currentUser) callback(true);
    else if (typeof callback == 'function') callback(false);
  });
};


/**
  *   Fetches session token for the currently signed in user and returns it via
  *   callback function
**/
export function getSessionToken(callback) {
  firebase.auth().currentUser.getToken(true).then((token) => {
    if (typeof callback == 'function') callback(token);
  }).catch((err) => {
    console.log("Error code", err.code, "\nError message", err.message);
    if (typeof callback == 'function') callback(null);
  });
};


/**
  *   Gets current user from Firebase and returns it via callback function
**/
export function getCurrentUser(callback) {
  if (typeof callback == 'function') callback(firebase.auth().currentUser);
};


/**
  *   Create a user in Firebase, alert caller of success
**/
export function createUser(data, callback) {
  firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then(() => {
    if (typeof callback == 'function') callback(true);
  }).catch(function(error) {
    console.log("errorCode: " +  error.code);
    console.log("errorMessage: " + error.message);
    if (typeof callback == 'function') callback(false);
  });
};

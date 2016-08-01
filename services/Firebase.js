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
import * as Timestamp from '../helpers/Timestamp';


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




//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
//                                 Getters
//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣


/**
  *   Fetches list of users and returns them via callback function
**/
export function getUsers(callback) {
  usernamesRef.once('value', function(snapshot) {
    console.log("USERS RIGHT AFTER GETTING THEM FROM FIREBASE\n", snapshot.val());
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
  *   Count number of unseen notifications for the current user and return
  *   it via callback
**/
export function getNumNotifications(uid, callback) {
  firebase.database().ref('/notifications/' + uid).once('value', (snapshot) => {
    var numNotifications = 0;
    for (var n in snapshot.val()) {
      if (!n.seen) numNotifications++;
    }
    callback(numNotifications);
  });
};

//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
//                                 Setters
//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣


// firebase.database().ref('/appFlags/' + uid).set({ val: true, hasx: false });
/**
  *   Create a flag
**/

//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
//                             User creation
//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣


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





//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
//                                 Auth
//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣


/**
  *   Authenticates user with specified email and password
**/
export function authWithEmail(data, callback) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password)
  .then(() => {
    if (firebase.auth().currentUser) callback(true);
    else if (typeof callback == 'function') callback(false);
  })
  .catch((err) => {
    console.log("Error code", err.code, "\nError message", err.message);
    if (typeof callback == 'function') callback(false);
  });
};


/**
  *   Authenticates user with Facebook access token, alerts caller of successs
**/
export function authWithFacebook(FBToken, callback) {
  // Get user credential from Firebase with FBToken
  var credential = firebase.auth.FacebookAuthProvider.credential(FBToken);
  // Sign in with the credential if it was sucessfully retrieved
  if (credential) firebase.auth().signInWithCredential(credential)
  .then(() => {
    if (firebase.auth().currentUser) callback(true);
    else if (typeof callback == 'function') callback(false);
  })
  .catch((err) => {
    console.log("Caught an error");
    console.log("Error code", err.code, "\nError message", err.message, "\nError", err);
    //alert("Error code", err.code, "\nError message", err.message);
    if (typeof callback == 'function') callback(false);
  });
};


/**
  *   Sign current user out
**/
export function signOut(callback) {
  firebase.auth().signOut();
  callback();
};





//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
//                                 Listeners
//  💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣


/**
  *   Listen for changes in the specified user's payment flow
**/
export function listenToPaymentFlow(uid, callback) {
  firebase.database().ref('/paymentFlow/' + uid + "/in").on('value', (snapshot) => {
    callback("in", snapshot.val());
  });
  firebase.database().ref('/paymentFlow/' + uid + "/out").on('value', (snapshot) => {
    callback("out", snapshot.val());
  });
};


/**
  *   Listen for changes in the specified user's notifications, pass new
**/
export function listenToNotifications(uid, callback) {
  firebase.database().ref('/notifications/' + uid).on('value', (snapshot) => {
    callback(snapshot.val());
  });
};


/**
  *   Listen for changes in the specified user's contact list, pass mutated
  *   list to caller on change
**/
export function listenToContacts(uid, callback) {
  firebase.database().ref('/contactList/' + uid).on('value', (snapshot) => {
    callback(snapshot.val());
  });
};

export function listenToTest(callback) {
  firebase.database().ref('/FirebaseBindingTest').on('value', (snapshot) => {
    callback(snapshot.val());
  });
};

/**
  *   Listen for changes in Firebase user list, returns event type and snapshot
**/
export function listenToUsers(callback) {
  usernamesRef.on('child_added', (childSnapshot, prevChildKey) => {
    callback('child_added', childSnapshot);
  });
  usernamesRef.on('child_removed', (oldChildSnapshot) => {
    callback('child_removed', oldChildSnapshot);
  });
  usernamesRef.on('child_changed', (childSnapshot, prevChildKey) => {
    callback('child_changed', childSnapshot);
  });
};


/**
  *   Listen to each of the specified routes
**/
export function listenTo(endpoints, callback) {
  var endpoint;

  for (var e in endpoints) {
    endpoint = endpoints[e];
    firebase.database().ref('/' + endpoints[e]).on('value', (snapshot) => {
      if (typeof callback == 'function') callback({ endpoint: endpoint, key: snapshot.key, value: snapshot.val() });
      else console.log("Callback is not a function");
    });
  }
};


/**
  *   Turn off all listeners for the provided database endpoints
**/
export function stopListeningTo(endpoints, callback) {
  for (var e in endpoints) {
    firebase.database().ref('/' + endpoints[e]).off('value', () => {
      if (typeof callback == 'function') callback();
      else console.log("Callback is not a function");
    });
  }
};

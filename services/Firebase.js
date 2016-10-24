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
import * as config from '../config';

// Initialize Firebase
firebase.initializeApp(config.details.dev.firebaseCredentials);

/**
  *   Fetches list of users and returns them via callback function
**/
export function getUsers(callback) {
  firebase.database().ref('/usernames').once('value', function(snapshot) {
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
  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.getToken(true).then((token) => {
      if (typeof callback == 'function') callback(token);
      else console.log("%cCallback is not a function", "color:red;font-weight:900;");
    }).catch((err) => {
      console.log("Error code", err.code, "\nError message", err.message);
      if (typeof callback == 'function') callback(null);
      else console.log("%cCallback is not a function", "color:red;font-weight:900;");
    });
  } else {
    if (typeof callback == 'function') callback(null);
    else console.log("%cCallback is not a function", "color:red;font-weight:900;");
  }
};


/** NOTE This is probably unnecessary! Use the Firebase listeners instead!
  *   Get a specific user's app flag
  *   Current Flags: account_status,
**/
export function getAppFlags(user_id){
  // Needs to pull data
  firebase.database().ref('/appFlags').child(user_id).once('value', function(snap){
    var flags = snap.val();
    return(flags);
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


/**
  *   Create the flags necessary for a user
  *   Current Flags: account_status,
**/
export function createAppFlags(user, account_status){
  //Needs to pull data
  firebase.database().ref('/appFlags/' + user.uid).set({ val: true, account_status: account_status  });
  console.log("CREATING APP FLAGS");
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
  .then((val) => {
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


/**
  *   Enable listeners on the specified Firebase endpoints, returning values
  *   via callback function
**/
export function listenTo(params) {
  // console.log("Enabling listener with params:");
  // console.log(params);
  params.listener = firebase.database().ref('/' + params.endpoint).on('value', (snapshot) => {
    if (typeof params.callback == 'function') params.callback(snapshot.val());
    else console.log("%cCallback is not a function", "color:red;font-weight:900;");
  });
}

/**
  *   Disable listeners on the specified Firebase endpoints
**/
export function stopListeningTo(params) {
  firebase.database().ref('/' + params.endpoint).off(params.eventType, params.listener);
};

/**
  *   Read the value at the specified Firebase endpoint and return it via
  *   callback function
**/
export function listenUntilFirstValue(endpoint, callback) {
  firebase.database().ref('/' + endpoint).on('value', (snapshot) => {
    firebase.database().ref('/' + endpoint).off();
    if (typeof callback == 'function') callback(snapshot.val());
    else console.log("Callback is not a function");
  });
};


/**
  *   Send the specified email a password reset link
**/
export function sendPasswordResetEmail(email, callback) {
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    if (typeof callback == 'function') callback(true);
    else console.log("Callback is not a function");
  }, function(error) {
    console.log("%cError sending password reset email: " + error, "color:red;font-weight:900;");
    if (typeof callback == 'function') callback(false);
    else console.log("Callback is not a function");
  });
};

/**
  *   Delete all data nested under the specified Firebase endpoint
**/
export function scrub(endpoint, callback) {
  firebase.database().ref('/' + endpoint).set({});
};

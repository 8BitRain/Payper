/**
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  _init.js  💣
  *
  *   Contains app initialization and authentication functions that combine
  *   helper functions from:
  *     💣  ~/services/Firebase.js
  *     💣  ~/services/Lambda.js
  *     💣  ~/helpers/Async.js
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
**/


// Dependencies
import * as Firebase from './services/Firebase';
import * as Lambda from './services/Lambda';
import * as Async from './helpers/Async';
import { Actions } from 'react-native-router-flux';


/**
  *   Sign in with session token. Upon success, initialize app
**/
export function signInWithToken(callback) {
  try {
    Async.get('session_token', (val) => {
      if (val) {
        Lambda.getUserWithToken(val, (user) => {
          if (user) {

            console.log("%cSuccessfully retrieved user object:", "color:green;font-weight:900;");
            console.log(user);

            // Sign in succeeded. Log the user to Async storage and take them
            // to the app.
            Async.set('user', JSON.stringify(user), () => {
              if (typeof callback == 'function') callback(true);
              else console.log("Callback is not a function.");
            });

          } else {
            if (typeof callback == 'function') callback(false);
            else console.log("Callback is not a function.");
          }
        });
      } else {
        if (typeof callback == 'function') callback(false);
        else console.log("Callback is not a function.");
      }
    });
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Sign in with email and password. Upon success, initialize app
**/
export function signInWithEmail(data, callback) {
  if (data.email && data.password) {
    Firebase.authWithEmail(data, (success) => {
      if (success) {
        Firebase.getSessionToken((token) => {
          if (token) {
            Lambda.getUserWithToken(token, (user) => {
              if (user) {
                console.log("%cSuccessfully retrieved user object:", "color:green;font-weight:900;");
                console.log(user);
                // Sign in succeeded. Log the user to Async storage and take them
                // to the app.
                Async.set('user', JSON.stringify(user), () => {
                  if (typeof callback == 'function') callback(true);
                  else console.log("%cCallback is not a function", "color:red;font-weight:900;");
                });
              }
            });
          } else {
            console.log("%cFailed to get session token from Firebase", "color:orange;font-weight:900;");
            if (typeof callback == 'function') callback(false);
            else console.log("%cCallback is not a function", "color:red;font-weight:900;");
          }
        });
      } else {
        if (typeof callback == 'function') callback(false);
        else console.log("%cCallback is not a function", "color:red;font-weight:900;");
      }
    });
  } else {
    console.log("%cInvalid email and password input (both must be strings)", "color:red;font-weight:900;");
    if (typeof callback == 'function') callback(false);
    else console.log("%cCallback is not a function", "color:red;font-weight:900;");
  }
};


/**
  *   Sign in with Facebook token. Upon success, initialize app
**/
export function signInWithFacebook(data, callback) {
  if (data.FBToken) Firebase.authWithFacebook(data.FBToken, (success) => {
    if (success) {
      Firebase.getSessionToken((token) => {

        data.user.token = token;

        Lambda.createFBUser(data.user, (user) => {
          if (user) {
            console.log("%cSuccessfully retrieved user object:", "color:green;font-weight:900;");
            console.log(user);

            // Sign in succeeded. Log the user to AsyncStorage
            Async.set('user', JSON.stringify(user), () => {

              // Log session_token to Async storage for next sign in
              Async.set('session_token', user.token, () => {
                console.log("%cSuccessfully logged session_token to AsyncStorage", "color:green;font-weight:900;");
                Async.get('session_token', (token) => {
                  console.log("TOKEN:", token);
                });
              });

              // Alert caller of success
              if (typeof callback == 'function') callback(true);
              else console.log("%cCallback is not a function", "color:red;font-weight:900;");
            });
          } else {
            console.log("%cReceived null user.", "color:blue;font-weight:900;");
            if (typeof callback == 'function') callback(false);
            else console.log("%cCallback is not a function", "color:red;font-weight:900;");
          }
        });
      });
    }
  });
  else console.log("%cAccess Token cannot be null", "color:red;font-weight:900;");
};


/**
  *   1) Create Firebase user
  *   2) Get a token for the user and attach it to the user's object
  *   2.5) Set initial flags for user
  *   3) POST user's object to Lambda endpoint
  *   4) Initialize the app
**/
export function createUser(input) {
  Firebase.createUser(input, (success) => {
    if (success) {
      //Set initial flags for the user created
      console.log("SETTING INITIAL USER FLAGS")
      Firebase.getSessionToken((token) => {
        input.token = token;
        Lambda.createUser(input, (user) => {
          if (user) {
            // Creation succeeded. Log the user to Async storage and take them
            // to the app.
            Async.set('user', JSON.stringify(user), () => {
              if (typeof callback == 'function') callback(true);
              else console.log("%cCallback is not a function", "color:red;font-weight:900;");
            });
          } else {
            console.log("%cReceived null user.", "color:blue;font-weight:900;");
            if (typeof callback == 'function') callback(false);
            else console.log("%cCallback is not a function", "color:red;font-weight:900;");
          }
        });
      });
    }
  });
};


/**
  *   1) Sign user out of Firebase
  *   2) Redirect user to landing page
**/
export function signOut() {
  Firebase.signOut(() => {
    Async.set('user', '', () => {
      Actions.LandingScreenView();
    });
  });
};


/**
  *   Initialize a payment
**/
export function createPayment(data, callback) {
  Lambda.createPayment(data, (res) => {
    callback(res);
  });
};


/**
  *
**/
export function initializeUsers(options, callback) {
  if (options.uid) {
    var users = {
      phone: [],
      facebook: [],
      payper: [],
    };

    // Get Payper contact list from Firebase
    Firebase.listenToPayperContacts(options.uid, (contacts) => {
      users.payper = contacts;
    });

    // Send phone numbers to Lambda endpoint to log them to user's Payper contacts
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        console.error("Error getting contacts:\n", err);
      } else {
        console.log("%cSuccessfully got native contacts:", "color:green;font-weight:900;");
        console.log(contacts);
        Lambda.updateContacts({token: options.token, })
      }
    });

    // Get cell phone contacts who use Payper
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        console.error("ERROR GETTING CONTACTS:", err);
      } else {
        Lambda.logContacts(contacts);
        console.log("USERS:", users);
        callback();
      }
    });
  } else console.log("Received null uid.");
};

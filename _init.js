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
const Contacts = require('react-native-contacts');
import * as Firebase from './services/Firebase';
import * as Lambda from './services/Lambda';
import * as Async from './helpers/Async';
import { Actions } from 'react-native-router-flux';


/**
  *   Log user's object, session_token, payment_flow, and a global user list
  *   to AsyncStorage.
**/
function initializeAppState(user) {
  user.full_name = user.first_name + " " + user.last_name;

  // Log user object and session token to AsyncStorage
  Async.set('user', JSON.stringify(user));
  Async.set('session_token', user.token);

  // Log global user list to AsyncStorage
  Firebase.getUsers((users) => {
    Async.set('users', JSON.stringify(users));
  });

  initializeUsers(user.uid, () => {
    console.log("initializeUsers() callback reached");
  });

  // Log number of unseen notifications to AsyncStorage
  Firebase.getNumNotifications(user.uid, (num) => {
    Async.set('num_notifications', num.toString());
  });

  // Log user's payment flow to AsyncStorage
  Firebase.getPaymentFlow(user, (flow) => {
    Async.set('payment_flow', JSON.stringify(flow), () => {
      //Actions.MainViewContainer();
    });
  });
};


/**
  *   Sign in with session token. Upon success, initialize app
**/
export function signInWithToken(callback) {
  /*try {
    Async.get('session_token', (val) => {
      if (val) {
        Lambda.getUserWithToken(val, (user) => {
          if (user) {
            initializeAppState(user);
            if (typeof callback == 'function') callback(true);
          } else {
            Actions.LandingScreenView();
          }
        });
      } else {
        Actions.LandingScreenView();
      }
    });
  } catch (err) {
    console.log(err);
  }*/
  //Commented to make debugging easier
  Actions.LandingScreenContainer();
};


/**
  *   Sign in with email and password. Upon success, initialize app
**/
export function signInWithEmail(data, callback) {
  if (data.email && data.password) {
    Firebase.authWithEmail(data, (success) => {
      if (!success) {
        callback(false);
      } else {
        Firebase.getSessionToken((token) => {
          if (token) {
            Lambda.getUserWithToken(token, (userData) => {
              if (userData) {
                initializeAppState(userData);
                if (typeof callback == 'function') callback(true);
              }
            });
          }
        });
      }
    });
  } else {
    console.log("Invalid email and password input (both must be strings)");
  }
};


/**
  *   Sign in with Facebook token. Upon success, initialize app
**/
export function signInWithFacebook(data, callback) {
  if (data.FBToken) Firebase.authWithFacebook(data.FBToken, (success) => {
    if (success) {
      Firebase.getSessionToken((token) => {
        console.log("Token Retrieved from Firebase.getSessionToken"
        + "\n" + "====================================="
        + "\n" + token);
        data.user.token = token;
        Lambda.createFBUser(data.user, (user, account_status) => {
          if (user && account_status) {
            console.log("Init(signInWithFacebook) user: " + JSON.stringify(user));

            //Create Flags for the new user
            Firebase.createAppFlags(user, account_status);
            //Note send the account_status back in initializeAppState or callback.
            initializeAppState(user);
            callback(true, user, data.user.token);

          }
          else {
            console.log("Received null user");
            callback(false);
          }
        });
      });
    }
  });
  else console.log("Access Token cannot be null");
};


/**
  *   1) Create Firebase user
  *   2) Get a token for the user and attach it to the user's object
  * 2.5) Set initial flags for user
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
          if (user) initializeAppState(user);
        });
      });
    }
  });
};


/**
  *   Create a DwollaCustomer
**/
export function createCustomer(data, callback){
  Lambda.createCustomer(data, (response) => {
    callback(response);
  });
}

/**
  *   1) Sign user out of Firebase
  *   2) Redirect user to landing page
**/
export function signOut() {
  Firebase.signOut(() => {
    Async.set('user', '');
    Async.set('payment_flow', '');
    Async.set('session_token', '');
    Async.set('users', '');
    Actions.LandingScreenView();
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
  * Update phone number
**/
export function updatePhone(data, callback){
  console.log(data);
  Lambda.updatePhone(data, (res) => {
    console.log("Updating Phone Value: " + res);
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

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
<<<<<<< HEAD
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
=======
>>>>>>> origin/create-payment-refactor
  *   Sign in with session token. Upon success, initialize app
**/
export function signInWithToken(callback) {
  /*try {
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
              if (typeof callback == 'function') callback(true, user, user.token );
              else console.log("%cCallback is not a function", "color:red;font-weight:900;");
            });
          } else {
            console.log("%cReceived null user.", "color:blue;font-weight:900;");
            if (typeof callback == 'function') callback(false, user, user.token);
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
<<<<<<< HEAD
  * 2.5) Set initial flags for user
=======
  *   2.5) Set initial flags for user
>>>>>>> origin/create-payment-refactor
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
        console.log("%cFirebaseToken: " + token, "color:purple;font-weight:700;");
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

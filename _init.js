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
  *   After initialization, triggers listeners located in
  *     💣  ~/_listen.js
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
**/


// Dependencies
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
  
  try {
    Async.set('user', JSON.stringify(user));
    Async.set('session_token', user.token);
    Firebase.getUsers((users) => {
      Async.set('users', JSON.stringify(users));
      console.log("=-=-= 1 =-=-=");
      console.log(users);
    });
    Firebase.getPaymentFlow(user, (flow) => {
      Async.set('payment_flow', JSON.stringify(flow), () => {
        Actions.MainViewContainer();
      });
    });
    initializeAppListeners();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Enable Firebase listeners
**/
function initializeAppListeners(user) {
  // Firebase.listenToUsers((type, data) => {
  //   switch (type) {
  //     case 'child_added':
  //       var child = {};
  //       child[data.key] = data.val();
  //       Async.merge('users', JSON.stringify(child));
  //       Async.get('users', (users) => {
  //         console.log(JSON.parse(users));
  //       });
  //     break;
  //     case 'child_removed':
  //       Async.get('users', (users) => {
  //         users = JSON.parse(users);
  //         delete users[data.key];
  //         Async.set('users', JSON.stringify(users));
  //       });
  //     break;
  //     case 'child_changed':
  //       Async.get('users', (users) => {
  //         users = JSON.parse(users);
  //         users[data.key] = data.val();
  //         Async.set('users', JSON.stringify(users));
  //       });
  //     break;
  //   }
  // });
};


/**
  *   Sign in with session token. Upon success, initialize app
**/
export function signInWithToken(callback) {
  try {
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
  }
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
  *   1) Create Firebase user
  *   2) Get a token for the user and attach it to the user's object
  *   3) POST user's object to Lambda endpoint
  *   4) Initialize the app
**/
export function createUser(input) {
  Firebase.createUser(input, (success) => {
    if (success) {
      Firebase.getSessionToken((token) => {
        input.token = token;
        Lambda.createUser(input, (user) => {
          if(user) initializeAppState(user);
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
    Async.set('user', '');
    Async.set('payment_flow', '');
    Async.set('session_token', '');
    Async.set('users', '');
    Actions.LandingScreenView();
  });
};

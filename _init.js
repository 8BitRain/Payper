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
export function init(user) {
  try {
    Async.set('user', JSON.stringify(user));
    Async.set('session_token', user.token);
    Firebase.getUsers((users) => {
      Async.set('users', JSON.stringify(users));
    });
    Firebase.getPaymentFlow(user, (flow) => {
      Async.set('payment_flow', JSON.stringify(flow), () => {
        Actions.MainViewContainer();
      });
    });
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Sign in with session token. Upon success, initialize app
**/
export function signInWithToken(callback) {
  try {
    Async.get('session_token', (val) => {
      if (val) {
        Lambda.getUserWithToken(val, (user) => {
          init(user);
          if (typeof callback == 'function') callback(true);
        });
      } else {
        Actions.SignInViewContainer();
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
        Firebase.getCurrentUser((user) => {
          Firebase.getSessionToken(user, (token) => {
            if (token) {
              Lambda.getUserWithToken(token, (userData) => {
                if (userData) {
                  init(userData);
                  if (typeof callback == 'function') callback(true);
                }
              });
            }
          });
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
          if(user) init(user);
        });
      });
    }
  });
};















//

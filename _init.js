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

        console.log("%cSuccessfully retrieved user object:", "color:orange;font-weight:900;");
        console.log(val);

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

            // Token has expired. Alert caller
            if (typeof callback == 'function') callback("expired_token");
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
  *   Return new session token
**/
export function signInWithRefreshToken(callback) {
  try {

    Firebase.getSessionToken((token) => {

      // Failed to refresh token. User must sign in manually
      if (token == null) callback(false);

      // Token refresh succeeded
      else {
        // Log token to AsyncStorage
        Async.set('session_token', token, () => {
          // Attempt sign in
          signInWithToken(function(signedIn) {
            if (typeof callback == 'function') callback(signedIn);
            else console.log("%cCallback is not a function", "color:red;font-weight:900");
          });
        });
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
    //Add code in to handle brute force attacking
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
              });

              // Alert caller of success
              if (typeof callback == 'function') callback(true, user, user.token);
              else console.log("%cCallback is not a function", "color:red;font-weight:900;");

                /* >>>>>>> eric_action_button
                Async.get('session_token', (token) => {
                  console.log("TOKEN:", token);
                });
                // Alert caller of success
                if (typeof callback == 'function') callback(true, user, user.token );
                else console.log("%cCallback is not a function", "color:red;font-weight:900;");
              }); <<<<<<< eric_action_button*/



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
  *   3) POST user's object to Lambda endpoint
  *   4) Initialize the app
**/
export function createUser(input, _callback) {
  Firebase.createUser(input, (success) => {
    if (success) {
      //Set initial flags for the user created
      console.log("SETTING INITIAL USER FLAGS")
      Firebase.getSessionToken((token) => {
        //input.token = token;
        var data = {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          token: token
        }
        _callback(true, token);
        console.log("%cFirebaseToken: " + token, "color:purple;font-weight:700;");
        Lambda.createUser(data, (user) => {
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
    } else{
      _callback(false, null);
    }
  });
};


/**
  *   Create a DwollaCustomer
**/
export function createCustomer(data, callback){
  Lambda.createCustomer(data, (response) => {
    console.log("_init.js Create Customer Resposne: " + response);
    callback(response);
  });
}

/**
  *   sendMicrodeposits Verification
**/
export function sendMicrodeposits(data, callback){
  Lambda.sendMicrodeposits(data, (response) => {
    console.log("sendMicrodeposits: " + response);
    callback(response);
  });
}

/*Grab IAV token for specic customer*/
 //Ping the server with firebase token
   //Server will respond with iav_token
 //Inject token into webview
 //Process
 //On Callback handle what occurs in webview

export function getIavToken(data, callback){
  Lambda.getIavToken(data, (iavTokenRecieved, iavToken) => {
    if(iavTokenRecieved){
      console.log("INIT IAVTOKEN: " + JSON.stringify(iavToken));
      callback(true, iavToken);
    }
  });
 }


/**
  *   1) Sign user out of Firebase
  *   2) Redirect user to landing page
**/
export function signout() {

  // Log out of Firebase
  Firebase.signOut(() => {
    Async.set('session_token', '');
    Async.set('user', '', () => {
      Actions.LandingScreenContainer();
    });
  });

};


/**
  *   Delete the specified user
**/
export function deleteUser(options, callback) {
  Lambda.deleteUser(options, (success) => {
    console.log("%cDelete user success: " + success, "color:blue;font-weight:900;");
    if (typeof callback == 'function') callback(success);
    else console.log("%cCallback is not a function.", "color:red;font-weight:900;");
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

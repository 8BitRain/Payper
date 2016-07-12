/**
  *   🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
  *   🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿 FUNCTIONALITY OVERVIEW 🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
  *   🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
  *
  *    🗿 When the splash page is reached, signInWithKey() is called.
  *    => If a key is found, user will be authenticated with Firebase and logged
  *       to AsyncStorage via with their:
  *         a) corresponding user object  (@Store:user)
  *         b) new session_token          (@Store:session_key)
  *         c) payment flow               (@Store:payment_flow)
  *         d) friend list                (@Store:friend_list)
  *       and be redirected to MainView
  *    => If a key is not found, user will be redirected to SignInView and, on
  *       submit, signInWithEmail() is called. Upon success, all the above is
  *       logged and the user is redirected to MainView.
  *
  *    🗿 Upon sign in success the app will subscribe to three listeners, each
  *       of which are outlined below.
  *
  *       1) subscribeToUser() - listens for changes to the user object in
  *          Firebase and updates @Store:user in AsyncStorage
  *
  *       2) subscribeToFriends() - listens for changes in the friendList object
  *          in Firebase and updates @Store:friend_list in AsyncStorage
  *
  *       3) subscribeToPayments() - listens for changes in the paymentFlow
  *          object in Firebase and updates @Store:payment_flow in AsyncStorage
  *
  *    🗿 Here I'll outline how each of these listeners trigger their respective
  *       view components.
  *
  *       1) When a change is detected, we call AS.mergeItem('old', 'new');
  *
  *       2) Upon success, a callback is triggered in the corresponding State.js
  *          script. (for example, when a payment is added, the callback from
  *          MainViewContainer.js is triggered)
  *
  *       3) This callback fetches the new payment list from AsyncStorage and
  *          updates the state, triggering a re-render in the view.
  *
  *     🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
  *     🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿 THE END 🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
  *     🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
**/

import { ReactNative, AsyncStorage } from "react-native";
import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwRj_BiJNEvKJC7GQSm9rv9dF_mjIhuzM",
  authDomain: "coincast.firebaseapp.com",
  databaseURL: "https://coincast.firebaseio.com",
  storageBucket: "firebase-coincast.appspot.com",
};
firebase.initializeApp(firebaseConfig);

/**
  *   Fetches list of users and stores them in AsyncStorage for later use
**/
export function getUsers() {
  firebase.database().ref('/usernames').on('value', function(snapshot) {
    console.log("=-=-= GOT USERS FROM FIREBASE =-=-=");
    console.log(snapshot.val());
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    try {
      AsyncStorage.setItem('@Store:users', JSON.stringify(snapshot.val()));
    } catch (err) {
      console.log("=-=-= ERROR STORING USERS IN ASYNC STORAGE =-=-=");
      console.log(err);
    }
  });
};


/**
  *   Creates a new Firebase user with email/password. Stores session token
  *   for that user in AsyncStorage
**/
export function createAccount(data) {

  // Create new Firebase user
  firebase.auth().createUserWithEmailAndPassword(data.email, data.password).catch(function(error) {
    console.log("=-=-= FIREBASE ERROR =-=-=");
    console.log("errorCode: " +  error.code);
    console.log("errorMessage: " + error.message);
  }).then(function() {

    console.log("=-=-= GOT TO .then() =-=-=");

    // Get user token returned by Firebase
    firebase.auth().currentUser.getToken(true).then(function(token) {

      console.log("=-=-= GOT TO getToken() =-=-=");

      // Attach user token to our user object
      data.token = token;

      // Send the user object user creation Lambda endpoint
      var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create";

      console.log('Sending POST request to ' + url);
      console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');

      fetch(url, {method: "POST", body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((responseData) => {
        AsyncStorage.setItem("@Store:session_key", token);
      })
      .done();

    }).catch(function(error) {
      // Handle error
    });
  });
};


/**
  *   Signs user in with email/password authentication. Stores session key in
  *   AsyncStorage upon success
**/
export function signInWithEmail(data, callback) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(function(error) {
      console.log("=-=-= FIREBASE ERROR =-=-=");
      console.log("errorCode: " +  error.code);
      console.log("errorMessage: " + error.message);
  }).then(function() {

    // Get current user (null if not signed in)
    var user = firebase.auth().currentUser;

    // If the user successfully signed in`
    if (user) {
      console.log("=-=-= SUCCESSFULLY SIGNED IN =-=-=");
      console.log("=-=-= REQUESTING USER TOKEN =-=-=");
      firebase.auth().currentUser.getToken(true).then(function(tkn) {

        // Trim so we're just looking at a unique section of the token
        console.log("=-=-= GOT USER TOKEN: " + tkn.substring(tkn.length - 6, tkn.length) + "=-=-=");

        // Send the user object user creation Lambda endpoint
        var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get";
        var data = {
          token: tkn,
        };

        console.log('Sending POST request to ' + url);
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        fetch(url, {method: "POST", body: JSON.stringify(data)})
        .then((response) => response.json())
        .then((responseData) => {

          if (!responseData.errorMessage) {
            logUser(responseData);
            callback(true);
          }

        })
        .done();


      }).catch(function(error) {
        // Handle error
      });
    } else {
      console.log("SIGN IN FAILED");
    }
  });

};


/**
  *   If there's a session key token in AsyncStorage, tries to sign user in
  *   with it. If session token has expired, user must sign in with email
  *   and password
**/
export function signInWithKey(callback) {

  AsyncStorage.getItem('@Store:session_key').then((key) => {
    try {

      if (key != null) {

        // Send the user object user creation Lambda endpoint
        var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get";
        var data = {
          token: key,
        };

        console.log('Sending POST request to ' + url);
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');

        fetch(url, {method: "POST", body: JSON.stringify(data)})
        .then((response) => response.json())
        .then((responseData) => {

          if (responseData.errorMessage) {
            console.log("=-=-= NEED A NEW TOKEN =-=-=");
            try {
              AsyncStorage.setItem('@Store:session_key', "").then(function(val) {
                console.log("=-=-= SUCCESSFULLY SET SESSION KEY TO NULL =-=-=");
              });
            } catch (err) {
              console.log("=-=-= ERROR SETTING SESSION KEY TO NULL =-=-=");
              console.log(err);
            }
          } else {
            logUser(responseData);
            callback(true);
          }
        })
        .done();
      }
    } catch (error) {
      console.log("=-=-= ERROR IN signInWithKey() =-=-=");
      console.log(error);
    }
  });

};

/**
  *   Helper function that logs all relevant aspects of the signed in user
  *   to AsyncStorage
**/
function logUser(user) {

  // Log session token
  try {
    AsyncStorage.setItem('@Store:session_key', user.token).then(() => {
      console.log("=-=-= SUCCESSFULLY LOGGED SESSION TOKEN =-=-=");
    });
  } catch (err) {
    console.log("=-=-= ERROR LOGGING SESSION TOKEN =-=-=");
    console.log(err);
  }

  // Log user object
  try {
    AsyncStorage.setItem('@Store:user', JSON.stringify(user)).then(() => {
      console.log("=-=-= SUCCESSFULLY LOGGED USER =-=-=");
    });
  } catch (err) {
    console.log("=-=-= ERROR LOGGING USER =-=-=");
    console.log(err);
  }

  // Fetch and, upon success, log user payment flow
  logPaymentFlow(user);
}

export function logPaymentFlow(user) {
  // Fetch and, upon success, log user payment flow
  try {
    var url = "/paymentFlow/" + user.uid;
    firebase.database().ref(url).once('value', function(snapshot) {
      console.log("=-=-= SUCCESSFULLY FETCHED USER PAYMENT FLOW =-=-=");
      try {
        AsyncStorage.setItem('@Store:payment_flow', JSON.stringify(snapshot.val())).then(() => {
          console.log("=-=-= SUCCESSFULLY LOGGED USER PAYMENT FLOW =-=-=");
          console.log(snapshot.val());
        });
      } catch (err) {
        console.log("=-=-= ERROR LOGGING USER PAYMENT FLOW =-=-=");
        console.log(err);
      }
    });
  } catch (err) {
    console.log("=-=-= ERROR LOGGING USER =-=-=");
    console.log(err);
  }
};

export function listen() {
  firebase.database().ref(url).on('child_added')
};

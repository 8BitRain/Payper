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

export function test() {
  firebase.database().ref('/usernames').on('value', function(snapshot) {
    console.log(snapshot.val());
  });
};

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
        console.log("POST response");
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        console.log(responseData);
        AsyncStorage.setItem("@Store:session_key", token);
      })
      .done();

    }).catch(function(error) {
      // Handle error
    });
  });
};

export function signInWithEmail(data) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(function(error) {
    console.log("=-=-= FIREBASE ERROR =-=-=");
    console.log("errorCode: " +  error.code);
    console.log("errorMessage: " + error.message);
  }).then(function() {

    console.log("=-=-= SUCCESSFULLY SIGNED USER IN =-=-=");
    console.log("=-=-= REQUESTING USER TOKEN =-=-=");

    firebase.auth().currentUser.getToken(true).then(function(tkn) {

      console.log("=-=-= GOT USER TOKEN: " + tkn + "=-=-=");

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
        console.log("POST response");
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        console.log(responseData);


      })
      .done();


    }).catch(function(error) {
      // Handle error
    });

  });
};

export function signInWithKey(callback) {

  AsyncStorage.getItem('@Store:session_key').then((key) => {
    try {
      if (key != "") {

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

            // If our token is expired, get a new token
            firebase.auth().currentUser.getToken(true).then(function(tkn) {
              console.log("=-=-= GOT ANOTHER USER TOKEN: " + tkn + "=-=-=");

              // Send the user object user creation Lambda endpoint
              var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get";
              var data = {
                token: tkn,
              };

              AsyncStorage.setItem('@Store:session_key', tkn).then(() => {
                console.log("=-=-= SUCCESSFULLY SET KEY =-=-=");
              });

              console.log('Sending POST request to ' + url);
              console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');

              fetch(url, {method: "POST", body: JSON.stringify(data)})
              .then((response) => response.json())
              .then((responseData) => {
                console.log("POST response");
                console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
                console.log(responseData);

                var user = JSON.stringify(responseData);

                AsyncStorage.setItem('@Store:user', user).then(() => {
                  console.log("=-=-= Succesfully logged user =-=-=");
                  callback(true);
                }).done();
              })
              .done();
            });
          } else {
            var user = JSON.stringify(responseData);

            AsyncStorage.setItem('@Store:user', user).then(() => {
              console.log("=-=-= Succesfully logged user =-=-=");
              callback(true);
            }).done();

            console.log("POST response");
            console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
            console.log("User: " + JSON.stringify(responseData));
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

export function getUsers() {
  var usersRef = new Firebase("https://brady.firebaseio.com/users");
  usersRef.once("value", async function(snapshot) {
    return snapshot.val();
  }, function (error) {
    console.log("The Firebase read failed: " + error.code);
  });
}

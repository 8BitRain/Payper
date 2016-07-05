// var firebase = require("firebase");
// firebase.initializeApp({
//   serviceAccount: "firebase_credentials.json",
//   databaseURL: "https://coincastdb.firebaseio.com/"
// });

const FIREBASE_TOKEN_GENERATOR = require('firebase-token-generator');
const Firebase = require('firebase');
let db = new Firebase("https://coincast.firebaseio.com/");

let tokenGenerator = new FIREBASE_TOKEN_GENERATOR("hVnPMQ21nkMAxCFQ1A6GpoGhFIkEsPsErVUJDMc6");
var token = tokenGenerator.createToken({uid: "coincast"});

db.authWithCustomToken(token, function(error, authData){
    console.log("Authenticated to DB: " + JSON.stringify("AUTH DATA: " + authData));

    if(error){
      console.log("ERROR: " + JSON.stringify(error));
    }
});

export function createAccount(data) {
  var password = data.password,
      email = data.email;

  db.createUser({
    'email': email,
    'password': password
  },
  (error, userData) => {
    if (error) {
      console.log(JSON.stringify(error));
      switch (error.code) {
        case "EMAIL_TAKEN":
          console.log("The new user account cannot be created because the email is already in use.");
          return "EMAIL_TAKEN";
          break;
        case "INVALID_EMAIL":
           console.log("The specified email is not a valid email.");
           break;
        default:
          console.log("Error creating user:");
       };
     } else {

       console.log('Your account was created!');
       console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
       console.log('Firebase responded with userData:');
       console.log(userData);
       console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');

       // POST URL
       var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create";
       data.uid = userData.uid;

       console.log('Sending POST request to ' + url);
       console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');

        fetch(url, {method: "POST", body: JSON.stringify({data})})
        .then((response) => response.json())
        .then((responseData) => {
          console.log("POST response:");
          console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
          console.log(responseData);
        })
        .done();

     }
  });
}

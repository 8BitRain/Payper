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
  }, (error, userData) => {
    if (error) {
      console.log(JSON.stringify(error));
      switch (error.code) {
        case "EMAIL_TAKEN":
          console.log("The new user account cannot be created because the email is already in use.");
          break;
        case "INVALID_EMAIL":
           console.log("The specified email is not a valid email.");
           break;
        default:
          console.log("Error creating user:");
       };
     } else {
       console.log('Your account was created!');
     }
  });
}

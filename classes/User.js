// Dependencies
import * as firebase from 'firebase';
import * as Async from '../helpers/Async';
import { Actions } from 'react-native-router-flux';
const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

export default class User {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i];
  }

  /**
    *   Log in to Firebase auth via email and password
    *   params: email (string), password (string)
    *   -----------------------------------------------------------------------
  **/
  loginWithEmail(params, onLoginSuccess, onLoginFailure) {
    firebase.auth().signInWithEmailAndPassword(params.email, params.password)
    .then(() => {
      if (firebase.auth().currentUser) {
        var firebaseUser = firebase.auth().currentUser.toJSON();
        this.getUserObjectWithToken({ token: firebaseUser.stsTokenManager.accessToken },
        (res) => {
          if (res.errorMessage) {
            this.logError(["getUserObjectWithToken failed...", "Lambda error:", res.errorMessage]);
            onLoginFailure("lambda");
          } else {
            this.update(res);
            Async.set('session_token', JSON.stringify(this.token));
            Async.set('user', JSON.stringify(this));
            this.logSuccess(["getUserObjectWithToken succeeded...", "Lambda response:", res]);
            onLoginSuccess();
          }
        });
      }
    })
    .catch((err) => {
      this.logError(["loginWithEmail failed...", "Code: " + err.code, "Message: " + err.message]);
      onLoginFailure(err.code);
    });
  }

  /**
    *   Log in to Firebase panel via Facebook token
    *   params: facebookToken (string)
    *   -----------------------------------------------------------------------
    *   onSuccess -> get user object from Lambda function, pass it to caller
    *   onFailure -> report to caller
  **/
  loginWithFacebook(params, onLoginSuccess, onLoginFailure) {
    // TODO (...)
  }

  /**
    *   Log in to Firebase auth via session token
    *   params: token (string)
    *   -----------------------------------------------------------------------
    *   onSuccess -> get user object from Lambda function, pass it to caller
    *   onFailure -> report to caller
  **/
  loginWithSessionToken(params, onLoginSuccess, onLoginFailure) {
    // TODO (...)
  }

  /**
    *   Log out of Firebase auth
    *   -----------------------------------------------------------------------
  **/
  logout() {
    this.logInfo(["Logging out..."]);
    if (this.provider === "facebook") LoginManager.logOut();
    firebase.auth().signOut();
    Async.set('session_token', '');
    Async.set('user', '');
    Actions.LandingScreenContainer();
    for (var i in this) if (typeof this[i] !== 'function') this[i] = null;
  }

  /**
    *   Fetch user object from Lambda
    *   params: token
    *   -----------------------------------------------------------------------
    *   onSuccess -> get user object from Lambda function, pass it to caller
    *   onFailure -> pass null to caller
  **/
  getUserObjectWithToken(params, callback) {
    try {
      fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/auth/get", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => callback(responseData))
      .done();
    } catch (err) {
      this.logError(["getUserObjectWithToken failed...", "Lambda error:", err]);
      callback(null);
    }
  }

  /**
    *   Cycle this user's access and refresh tokens
    *   -----------------------------------------------------------------------
  **/
  refresh() {
    this.logInfo(["Refreshing access token..."]);
    // TODO (...)
  }

  /**
    *   Update this user's props
    *   props: a JSON containing propKey and propValue pairs
    *   -----------------------------------------------------------------------
  **/
  update(props) {
    this.logInfo(["Updating user with props:", props]);
    if (props) for (var i in props) this[i] = props[i];
  }

  logError(strings) {
    if (!this.enableLogs) return;
    console.log("%c----------------------------------------------------------------------", "color:red;font-weight:900");
    for (var s in strings) console.log(strings[s]);
    console.log("%c----------------------------------------------------------------------", "color:red;font-weight:900");
  }
  logInfo(strings) {
    if (!this.enableLogs) return;
    console.log("%c----------------------------------------------------------------------", "color:purple;font-weight:900");
    for (var s in strings) console.log(strings[s]);
    console.log("%c----------------------------------------------------------------------", "color:purple;font-weight:900");
  }
  logSuccess(strings) {
    if (!this.enableLogs) return;
    console.log("%c----------------------------------------------------------------------", "color:green;font-weight:900");
    for (var s in strings) console.log(strings[s]);
    console.log("%c----------------------------------------------------------------------", "color:green;font-weight:900");
  }
}

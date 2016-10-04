// Dependencies
import * as firebase from 'firebase';
import * as Firebase from '../services/Firebase';
import * as Async from '../helpers/Async';
import * as SetMaster5000 from '../helpers/SetMaster5000';
import { Actions } from 'react-native-router-flux';
const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

export default class User {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i];
  }

  /**
    *   Update this user's props, then log the new user object to async storage
    *   props: a JSON containing propKey and propValue pairs
    *   -----------------------------------------------------------------------
  **/
  update(props) {
    this.logInfo(["Updating user with props:", props]);
    if (props) for (var i in props) this[i] = props[i];
    Async.set('user', JSON.stringify(this));
  }

  /**
    *   Initialize this user's props, listeners, and async storage links
    *   props: user, a JSON user object returned by getUser Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  initialize(user) {
    this.update(user);
    Async.set('session_token', JSON.stringify(user.token));
    Async.set('user', JSON.stringify(user));
    this.startListening();
  }

  /**
    *   Wipe this user's props, listeners, and async storage links
    *   -----------------------------------------------------------------------
  **/
  destroy() {
    Async.set('session_token', '');
    Async.set('user', '');
    this.stopListening();
    for (var i in this) if (typeof this[i] !== 'function') this[i] = null;
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
            this.initialize(res);
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
  **/
  loginWithFacebook(params, onLoginSuccess, onLoginFailure) {
    // TODO (...)
  }

  /**
    *   Log in to Firebase auth via session token
    *   params: token (string)
    *   -----------------------------------------------------------------------
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
    Actions.LandingScreenContainer();
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
    *   Enable listeners on this user's Firebase data
    *   -----------------------------------------------------------------------
  **/
  startListening() {
    this.endpoints = [
      {
        endpoint: 'users/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => this.update(res)
      },
      {
        endpoint: 'paymentFlow/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (res.out) SetMaster5000.tackOnKeys(res.out, "pid");
          if (res.in) SetMaster5000.tackOnKeys(res.in, "pid");
          this.update({ paymentFlow: res });
        }
      },
      {
        endpoint: 'appFlags/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => this.update({ appFlags: res })
      },
      {
        endpoint: 'notifications/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          SetMaster5000.tackOnKeys(res, "timestamp");
          this.update({ notifications: res });
        }
      },
      {
        endpoint: 'blockedUsers/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => this.update({ blockedUsers: res })
      }
    ];

    this.logInfo(["Enabling listener with params:", this.endpoints]);
    for (var e in this.endpoints) {
      Firebase.listenTo(this.endpoints[e]);
    }
  }

  /**
    *   Disable listeners on this user's Firebase data
    *   -----------------------------------------------------------------------
  **/
  stopListening() {
    for (var e in this.endpoints) {
      Firebase.stopListeningTo(this.endpoints[e]);
    }
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

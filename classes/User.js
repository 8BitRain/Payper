// Dependencies
import * as firebase from 'firebase';

export default class User {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i];
  }

  /**
    *   Log in to Firebase auth via email and password
    *   params: email (string), password (string)
    *   -----------------------------------------------------------------------
  **/
  loginWithEmail(params) {
    firebase.auth().signInWithEmailAndPassword(params.email, params.password)
    .then(() => {
      if (firebase.auth().currentUser) {
        var firebaseUser = firebase.auth().currentUser.toJSON();
        this.getUserObjectWithToken({ token: firebaseUser.stsTokenManager.accessToken },
        (res) => {
          if (res.errorMessage) {
            this.logError(["getUserObjectWithToken failed...", "Lambda error:", res.errorMessage]);
            this.onLoginFailure("lambda");
          } else {
            this.update(res);
            this.logSuccess(["getUserObjectWithToken succeeded...", "Lambda response:", res]);
            this.onLoginSuccess();
          }
        });
      }
    })
    .catch((err) => {
      this.logError(["loginWithEmail failed...", "Code: " + err.code, "Message: " + err.message]);
      this.onLoginFailure(err.code);
    });
  }

  /**
    *   Log in to Firebase panel via Facebook token
    *   params: facebookToken (string)
    *   -----------------------------------------------------------------------
    *   onSuccess -> get user object from Lambda function, pass it to caller
    *   onFailure -> report to caller
  **/
  loginWithFacebook(params) {
    // TODO (...)
  }

  /**
    *   Log in to Firebase auth via session token
    *   params: token (string)
    *   -----------------------------------------------------------------------
    *   onSuccess -> get user object from Lambda function, pass it to caller
    *   onFailure -> report to caller
  **/
  loginWithSessionToken(params) {
    // TODO (...)
  }

  /**
    *   Log out of Firebase auth
    *   -----------------------------------------------------------------------
  **/
  logout() {
    this.logInfo(["Logging out..."]);
    // TODO (...)
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

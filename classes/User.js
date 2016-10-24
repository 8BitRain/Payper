// Dependencies
import * as firebase from 'firebase';
import * as Firebase from '../services/Firebase';
import * as Lambda from '../services/Lambda';
import * as Async from '../helpers/Async';
import * as SetMaster5000 from '../helpers/SetMaster5000';
import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import Contacts from 'react-native-contacts';
const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

import * as config from '../config';
let baseURL = config.details.dev.lambdaBaseURL;

export default class User {
  constructor(attributes) {
    if (attributes) for (var i in attributes) this[i] = attributes[i];
    this.appFlags = {};
    this.allContactsArray = [];
    this.nativeContacts = [];
  }

  /**
    *   Update this user's attributes, then log the new user object to async storage
    *   attributes: a JSON containing propKey and propValue pairs
    *   -----------------------------------------------------------------------
  **/
  update(updates) {
    console.log("Updating User with updates:", updates);
    for (var k in updates) this[k] = updates[k];
    if (this.appFlags && this.appFlags.onboarding_state !== 'customer')
      Async.set('user', JSON.stringify(this));
  }

  /**
    *   Initialize this user's attributes, listeners, and async storage links
    *   attributes: user, a JSON user object returned by getUser Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  initialize(user) {
    this.update(user);

    // Tack on decryptedPhone and decryptedEmail
    this.decrypt((res) => {
      if (res) this.update(res);
    });

    // Refresh Firebase token every 20 minutes
    this.tokenRefreshInterval = setInterval(() => {
      this.refresh();
    }, ((60 * 1000) * 20));
  }

  /**
    *   Delete this user
  **/
  delete(cb) {
    const _this = this;

    // Delete user from Firebase auth
    let user = firebase.auth().currentUser;
    user.delete().then(
    () => {
      cb(true);

      // Delete user data via Lambda endpoint
      try {
        fetch(baseURL + "user/delete", {method: "POST", body: JSON.stringify({ token: _this.token, uid: _this.uid })})
        .then((response) => response.json())
        .then((responseData) => {
          if (!responseData.errorMessage) {
            console.log("Delete user Lambda response:", responseData);
            _this.destroy();
          } else {
            console.log("Error deleting user:", responseData.errorMessage);
          }
        })
        .done();
      } catch (err) {
        console.log("getUserWithToken failed...", "Lambda error:", err);
      }
    },
    (err) => {
      console.log("Error deleting user from Firebase auth:", err);
      cb(false);
    });
  }

  /**
    *   Wipe this user's attributes, listeners, and async storage links
    *   -----------------------------------------------------------------------
  **/
  destroy() {
    Async.set('user', '');
    this.stopListening();
    clearInterval(this.tokenRefreshInterval);
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
        this.getUserWithToken({ token: firebaseUser.stsTokenManager.accessToken },
        (res) => {
          if (res.errorMessage) {
            console.log("getUserWithToken failed...", "Lambda error:", res.errorMessage);
            onLoginFailure("lambda");
          } else {
            this.initialize(res);
            console.log("getUserWithToken succeeded...", "Lambda response:", res);
            onLoginSuccess();
          }
        });
      }
    })
    .catch((err) => {
      console.log("loginWithEmail failed...", "Code: " + err.code, "Message: " + err.message);
      onLoginFailure(err.code);
    });
  }

  /**
    *   Log in to Firebase panel via Facebook token
    *   params: facebookToken (string)
    *   -----------------------------------------------------------------------
  **/
  loginWithFacebook(params, onLoginSuccess, onLoginFailure) {
    var credential = firebase.auth.FacebookAuthProvider.credential(params.facebookToken);

    if (credential) firebase.auth().signInWithCredential(credential)
    .then((val) => {
      var firebaseUser = firebase.auth().currentUser.toJSON();
      if (firebaseUser) params.user.token = firebaseUser.stsTokenManager.accessToken;
      this.getOrCreateFacebookUser(params.user,
      (res) => {
        if (res.errorMessage) {
          console.log("getUserWithToken failed...", "Lambda error:", res.errorMessage);
          onLoginFailure("lambda");
        } else {
          console.log("getUserWithToken succeeded...", "Lambda response:", res.user);
          // Tack on appFlags
          firebase.database().ref('appFlags').child(res.user.uid).once('value', (snapshot) => {
            let appFlags = snapshot.val();
            res.user.appFlags = (appFlags) ? appFlags : {};
            this.initialize(res.user);
            onLoginSuccess(res.user);
          })
          .catch((err) => {
            console.log("Error getting appFlags:", err);
            this.initialize(res.user);
            onLoginSuccess(res.user);
          })
          .done();
        }
      });
    })
    .catch((err) => {
      console.log("loginWithFacebook failed...", "Code: " + err.code, "Message: " + err.message);
      onLoginFailure(err.code);
    });
  }

  /**
    *   Log in to Firebase auth via session token
    *   params: token (string)
    *   -----------------------------------------------------------------------
  **/
  loginWithAccessToken(params, onLoginSuccess, onLoginFailure) {
    this.getUserWithToken(params, (res) => {
      if (res.errorMessage) {
        console.log("getUserWithToken failed...", "Lambda error:", res.errorMessage);
        onLoginFailure("lambda");
      } else {
        this.initialize(res);
        console.log("getUserWithToken succeeded...", "Lambda response:", res);
        onLoginSuccess();
      }
    });
  }

  /**
    *   Log out of Firebase auth
    *   -----------------------------------------------------------------------
  **/
  logout() {
    console.log("Logging out...");
    if (this.provider === "facebook") LoginManager.logOut();
    firebase.auth().signOut();
    this.stopListening();
    this.destroy();
    Actions.LandingScreenViewContainer();
  }

  /**
    *   Fetch user object from Lambda
    *   params: token
    *   -----------------------------------------------------------------------
  **/
  getUserWithToken(params, callback) {
    try {
      fetch(baseURL + "auth/get", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {

        // Tack on user's appFlags
        let ref = firebase.database().ref('appFlags');
        ref.once('value')
        .then((snapshot) => {
          let appFlags = snapshot.child(responseData.uid).val();
          responseData.appFlags = appFlags;
          callback(responseData);
        })
        .catch((err) => {
          console.log("Firebase error getting appFlags:", err);
          callback(responseData);
        });

      })
      .done();
    } catch (err) {
      console.log("getUserWithToken failed...", "Lambda error:", err);
      callback(null);
    }
  }

  /**
    *   Create a Facebook user or, if one already exists, retrieve its user
    *   object from Lambda
    *   params: a JSON containing user data and access token (if any)
    *   -----------------------------------------------------------------------
  **/
  getOrCreateFacebookUser(params, callback) {
    try {
      fetch(baseURL + "user/facebookCreate", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => callback(responseData))
      .done();
    } catch (err) {
      console.log("getOrCreateFacebookUser failed...", "Lambda error:", err);
      callback(null);
    }
  }

  /**
    *   Create a user with email and password
    *   params: email, password, phone, firstName, lastName
    *   -----------------------------------------------------------------------
  **/
  createUserWithEmailAndPassword(params, onSuccess, onFailure) {
    console.log("createUserWithEmailAndPassword was invoked with params:", params);
    firebase.auth().createUserWithEmailAndPassword(params.email, params.password).then(() => {
      firebase.auth().currentUser.getToken(true).then((token) => {
        params.token = token;
        params.password = null;
        var stringifiedParams = JSON.stringify(params);
        try {
          fetch(baseURL + "user/create", {method: "POST", body: stringifiedParams})
          .then((response) => response.json())
          .then((responseData) => {
            if (!responseData.errorMessage) {
              responseData.user.token = token;
              this.initialize(responseData.user);
              this.decryptedPhone = params.phone;
              this.decryptedEmail = params.email;
              console.log("createUserWithEmailAndPassword succeeded...", "Lambda response:", responseData);
              onSuccess();
            } else {
              onFailure("lambda");
            }
          })
          .done();
        } catch (err) {
          console.log("createUserWithEmailAndPassword failed...", "Fetch error:", err);
          onFailure();
        }
      }).catch((err) => {
        console.log("firebase.auth().currentUser.getToken(true) failed...", "Firebase error:", err);
        onFailure(err.code);
      });
    })
    .catch((err) => {
      console.log("firebase.auth().createUserWithEmailAndPassword failed...", "Firebase error:", err);
      onFailure(err.code);
    });
  }

  /**
    *   Create a Dwolla customer for this user
    *   params: firstName, lastName, address, city, state, zip, dob, ssn
    *   tacked on params: email, phone, token
    *   -----------------------------------------------------------------------
  **/
  createDwollaCustomer(params, onSuccess, onFailure) {
    params.email = this.decryptedEmail;
    params.phone = this.decryptedPhone;
    params.token = this.token;

    try {
      fetch(baseURL + "customer/create", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) {
          console.log("createDwollaCustomer succeeded...", "Response data:", responseData);
          onSuccess(responseData.status);
        } else {
          console.log("createDwollaCustomer failed...", "Error:", responseData.errorMessage);
          onFailure(responseData.errorMessage);
        }
      })
      .done();
    } catch (err) {
      console.log("createDwollaCustomer failed...", "Try/catch threw:", err);
      onFailure(err);
    }
  }

  /**
    *   Retry Dwolla customer creation
    *   params: firstName, lastName, address, city, state, zip, dob, ssn
    *   tacked on params: email, phone, token
    *   -----------------------------------------------------------------------
  **/
  retryDwollaVerification(params, onSuccess, onFailure) {
    params.email = this.decryptedEmail;
    params.phone = this.decryptedPhone;
    params.token = this.token;

    console.log("retryDwollaVerification was invoked with params:", params);

    try {
      fetch(baseURL + "customer/retryVerification", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) {
          console.log("retryDwollaVerification succeeded...", "Response data:", responseData);
          onSuccess(responseData.status);
        } else {
          console.log("retryDwollaVerification failed...", "Error:", responseData.errorMessage);
          onFailure(responseData.errorMessage);
        }
      })
      .done();
    } catch (err) {
      console.log("retryDwollaVerification failed...", "Try/catch threw:", err);
      onFailure(err);
    }
  }

  /**
    *   Get this user's native phone contacts
    *   -----------------------------------------------------------------------
  **/
  getNativeContacts(updateViaRedux) {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        console.log("Error getting contacts", err);
      } else {
        const _this = this;

        var c = SetMaster5000.formatNativeContacts(contacts);
        updateViaRedux({ nativeContacts: c });

        Lambda.updateContacts({ token: this.token, phoneNumbers: SetMaster5000.contactsArrayToNumbersArray(c) }, () => {
          Firebase.listenUntilFirstValue("existingPhoneContacts/" + this.uid, (res) => {
            Firebase.scrub("existingPhoneContacts/" + this.uid);
            if (Array.isArray(res) && res.length > 0) {
              var parsedContacts = SetMaster5000.parseNativeContactList({ phoneNumbers: res, contacts: c });
              updateViaRedux({ nativeContacts: parsedContacts });
            }
          });
        });
      }
    });
  }

  /**
    *   Get user's bank account information (if any) from Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  getFundingSource(cb) {
    var params = { token: this.token };

    try {
      fetch(baseURL + "customer/getFundingSource", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData) {
          console.log("getFundingSource response was null");
          return;
        }
        if (responseData && !responseData.errorMessage) cb({ bankAccount: responseData });
        else console.log("Error getting funding source", responseData.errorMessage);
      })
      .done();
    } catch (err) {
      console.log("Error getting funding source", err);
    }
  }

  /**
    *   Get decrypted version of all encrypted user attributes from Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  decrypt(cb) {
    var params = { token: this.token, uid: this.uid };

    try {
      fetch(baseURL + "user/getPersonal", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) cb({ decryptedEmail: responseData.email, decryptedPhone: responseData.phone });
        else console.log("Error decrypting user", responseData.errorMessage);
      })
      .done();
    } catch (err) {
      console.log("Error decrypting user", err);
    }
  }

  /**
    *   Get a new IAV token for this user
    *   params: token
    *   -----------------------------------------------------------------------
  **/
  getIAVToken(params, updateViaRedux) {
    try {
      fetch(baseURL + "utils/getIAV", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) {
          if (responseData.token)
            updateViaRedux({ IAVToken: responseData.token });
          else
            console.log("getIAVToken received an undefined token.");
        }
        else
          console.log("Error getting IAV token:", responseData.errorMessage);
      })
      .done();
    } catch (err) {
      console.log("Error getting IAV token:", responseData.errorMessage);
    }
  };

  /**
    *   Cycle this user's access and refresh tokens
    *   -----------------------------------------------------------------------
  **/
  refresh() {
    const _this = this;
    firebase.auth().currentUser.getToken(true)
    .then(function(tkn) {
      _this.update({ token: tkn });
    }).catch(function(err) {
      console.log("Error getting new token:", err);
    });
  }

  /**
    *   Enable listeners on this user's Firebase data
    *   -----------------------------------------------------------------------
  **/
  startListening(updateViaRedux) {
    this.endpoints = [
      {
        endpoint: 'users',
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return;
          var globalUserListArray = SetMaster5000.globalUserListToArray({ sectionTitle: "Other Payper Users", users: res, uid: this.uid });
          globalUserListArray.concat(this.nativeContacts);
          updateViaRedux({ allContactsArray: globalUserListArray });
        }
      },
      {
        endpoint: 'users/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return;
          updateViaRedux(res);
          if (res.fundingSource) {
            res.fundingSource.active = true;
            this.getFundingSource((fs) => updateViaRedux(fs));
          }
        }
      },
      {
        endpoint: 'paymentFlow/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return;
          if (res.out) res.out = SetMaster5000.processPayments({ payments: res.out, flow: "outgoing" });
          if (res.in) res.in = SetMaster5000.processPayments({ payments: res.in, flow: "incoming" });
          updateViaRedux({ paymentFlow: res });
        }
      },
      {
        endpoint: 'appFlags/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return;
          if (res.onboarding_state === "bank")
            this.getIAVToken({ token: this.token }, updateViaRedux);
          updateViaRedux({ appFlags: res });
        }
      },
      {
        endpoint: 'notifications/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return;
          SetMaster5000.tackOnKeys(res, "timestamp");
          updateViaRedux({ notifications: res });
        }
      },
      {
        endpoint: 'blockedUsers/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return;
          updateViaRedux({ blockedUsers: res });
        }
      }
    ];

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
    this.endpoints = null;
  }
}

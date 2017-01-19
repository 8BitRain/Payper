import Mixpanel from 'react-native-mixpanel'
import firebase from 'firebase'
import * as config from '../config'
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import { FBLoginManager } from 'NativeModules'
import { Actions } from 'react-native-router-flux'
const baseURL = config.details[config.details.env].lambdaBaseURL

/**
  *   Given a Facebook Graph API access token ('token'), retrieve the corresponding
  *   Facebook user's data and return it via callback function. Return null if
  *   no user found or API error occured
**/
exports.requestFacebookUserData = function(token, cb) {
  // Configure Graph API request object
  let graphParams = '/me/?fields=email,age_range,first_name,last_name,gender,picture,friends&type=square'
  let graphRequest = new GraphRequest(graphParams, null, (err: ?Object, result: ?Object) => {
    (err) ? onFailure(err) : onSuccess(result)
  })

  // Send Graph API request
  new GraphRequestManager().addRequest(graphRequest).start()

  // Handle success
  function onSuccess(result) {
    let { first_name, last_name, email, picture, phone, gender, friends, id } = result
    let userData = {
      first_name, last_name, email, phone, gender, friends, token,
      facebook_id: id,
      profile_pic: (result.picture.data.is_silhouette) ? "" : result.picture.data.url
    }
    cb(userData)
  }

  // Handle failure
  function onFailure(err) {
    alert("Something went wrong. Please try again later.")
    Mixpanel.trackWithProperties('Failed Facebook Signin', { err: err })
    cb(null)
  }
}

exports.signout = function(currentUser) {
  Actions.LandingScreenViewContainer()
  firebase.auth().signOut()
  FBLoginManager.logOut()
  currentUser.destroy()
}

exports.signin = function(params, cb) {
  let {
    type, facebookToken, facebookUserData, accessToken, email, pass, key, uid
  } = params

  // Declare signin function var
  let signin

  // Initialize signin function var depending on signin mode
  switch (type) {
    case "facebook": signin = (cb) => signinFacebook(cb); break;
    case "generic": signin = (cb) => signinGeneric(cb); break;
    case "cached": signin = (cb) => signinCached(cb); break;
    default: signin = () => cb(null)
  }

  /**
    *   User is not cached
    *   (1) use firebaseUser's accessToken to get a customToken and key
    *   (2) fetch user details from firebase database
    *   (3) attach customToken and key to user details
    *   (4) return user details
    *   (app initialization will occur in signin's callback function)
  **/
  signin((firebaseUser, isNewFacebookUser, err) => {
    if (err) { cb({errCode: err.code}); return; }
    if (!firebaseUser) { cb(null); return; }
    let { accessToken } = firebaseUser.stsTokenManager

    getCustomTokenAndKey(accessToken, null, (res) => {
      let { customToken, key } = res

      firebase.auth().signInWithCustomToken(customToken).then((responseData) => {
        let { uid, providerData, stsTokenManager } = responseData.toJSON()
        let accessToken = stsTokenManager.accessToken

        if (isNewFacebookUser) {
          facebookUserData.token = accessToken

          try {
            fetch(baseURL + "user/facebookCreate", {method: "POST", body: JSON.stringify(facebookUserData)})
            .then((response) => response.json())
            .then((responseData) => {
              console.log("user/facebookCreate responseData", responseData)
              if (responseData.errorMessage) {
                cb(responseData, true)
              } else {
                var userData = responseData.user

                // Get appFlags before notifying caller of success
                firebase.database().ref('/appFlags').child(userData.uid).once('value', (snapshot) => {
                  let appFlags = snapshot.val() || {}
                  userData.appFlags = appFlags
                  console.log("--> userData", userData)
                  cb(userData, true)
                })
              }
            })
            .done()
          } catch (err) {
            console.log("user/facebookCreate failed...", "err:", err)
            cb(err)
          }
        } else {
          getUserDetails(uid, (userDetails) => {
            userDetails.token = accessToken
            userDetails.customToken = customToken
            userDetails.key = key
            cb(userDetails)
          })
        }
      }).catch((err) => {
        console.log(err)
        cb(null)
      })
    })
  })

  /**
    *   User is cached
    *   (1) check to make sure user exists in Firebase (prevents loading of
    *       an undefined user in the case of account deletion)
    *   (2) use cached user key to get new custom token
    *   (3) use new custom token sign in and get new accessToken
    *   (4) attach new customToken and accessToken to user object
    *   (5) return firebaseUser to caller
  **/
  function signinCached(cb) {
    firebase.database().ref('users').child(uid).once('value', (snapshot) => {
      let userData = snapshot.val()
      console.log("--> signing in via cache.... userData:", userData)

      // User does not exist (was likely deleted from another device)
      if (!userData) {
        cb(null)
        return
      }

      // User exists. Continue signin execution
      getCustomTokenAndKey(accessToken, key, (res) => {
        if (!res) {
          cb(null)
          return
        }

        let { customToken, key } = res

        firebase.auth().signInWithCustomToken(customToken).then((user) => {
          let firebaseUser = user.toJSON()
          cb(firebaseUser)
        }).catch((err) => {
          console.log(err)
          cb(null)
        })
      })
    })
  }

  /**
    *   User is not cached
    *   (1) create firebase facebook credential using facebook access token
    *   (2) call firebase auth's signInWithCredential
    *   (3) return firebaseUser to caller
  **/
  function signinFacebook(cb) {
    let Facebook = firebase.auth.FacebookAuthProvider
    let cred = Facebook.credential(facebookToken)

    firebase.auth().signInWithCredential(cred).then((user) => {
      let firebaseUser = user.toJSON()

      // Check if this is a new Facebook user
      firebase.database().ref('/users').child(firebaseUser.uid).once('value', (snapshot) => {
        let isNewFacebookUser = snapshot.val() === null
        cb(firebaseUser, isNewFacebookUser)
      })
    }).catch((err) => {
      console.log(err)
      cb(null)
    })
  }

  /**
    *   User is not cached
    *   (1) call firebase auth's signInWithEmailAndPassword
    *   (2) return firebaseUser to caller
  **/
  function signinGeneric(cb) {
    firebase.auth().signInWithEmailAndPassword(email, pass).then((user) => {
      let firebaseUser = user.toJSON()
      cb(firebaseUser)
    }).catch((err) => {
      console.log(err)
      cb(null, null, err)
    })
  }
}

/**
  *   Fetch a customToken and key for the specified user
**/
function getCustomTokenAndKey(firebaseToken, key, cb) {
  let env = config.details.env
  let body = { token: firebaseToken, env: env, key: key }

  fetch("https://www.getpayper.io/getToken", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((responseData) => cb(responseData))
  .catch((err) => { console.log(err); cb(null) })
  .done()
}

/**
  *   Fetch a user's details and appFlags from Firebase
**/
function getUserDetails(uid, cb, isFacebookUser) {
  let detailsRef = firebase.database().ref('/users')
  let appFlagsRef = firebase.database().ref('/appFlags')

  detailsRef.child(uid).once('value', (snapshot) => {
    let details = snapshot.val() || {}
    details.uid = uid

    appFlagsRef.child(uid).once('value', (snapshot) => {
      let val = snapshot.val() || {}
      details.appFlags = val
      cb(details)
    })
  })
}

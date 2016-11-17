import Mixpanel from 'react-native-mixpanel'
import firebase from 'firebase'
import * as config from '../config'
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

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
    Mixpanel.trackWithProperties('Failed Facebook Signin', { err: err });
    cb(null)
  }
}

exports.signin = function(params, cb) {
  let { type, facebookToken, accessToken, email, pass, key } = params

  // Determine which signin function to use
  let signin
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
  signin((firebaseUser) => {
    if (!firebaseUser) { cb(null); return; }
    let { accessToken } = firebaseUser.stsTokenManager

    getCustomTokenAndKey(accessToken, null, (res) => {
      let { customToken, key } = res

      firebase.auth().signInWithCustomToken(customToken).then((responseData) => {
        let { uid } = responseData.toJSON()

        getUserDetails(uid, (userDetails) => {
          userDetails.token = accessToken
          userDetails.customToken = customToken
          userDetails.key = key
          cb(userDetails)
        })
      }).catch((err) => {
        console.log(err)
        cb(null)
      })
    })
  })

  /**
    *   User is cached
    *   (1) use cached user key to get new custom token
    *   (2) use new custom token sign in and get new accessToken
    *   (3) attach new customToken and accessToken to user object
    *   (4) return firebaseUser to caller
  **/
  function signinCached(cb) {
    getCustomTokenAndKey(accessToken, key, (res) => {
      let { customToken, key } = res

      firebase.auth().signInWithCustomToken(customToken).then((user) => {
        let firebaseUser = user.toJSON()
        cb(firebaseUser)
      }).catch((err) => {
        console.log(err)
        cb(null)
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
      cb(firebaseUser)
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
      cb(null)
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
function getUserDetails(uid, cb) {
  let detailsRef = firebase.database().ref('/users')
  let appFlagsRef = firebase.database().ref('/appFlags')

  detailsRef.child(uid).once('value', (snapshot) => {
    let details = snapshot.val() || {}
    details.uid = uid

    appFlagsRef.child(uid).once('value', (snapshot) => {
      let val = snapshot.val() || null
      details.appFlags = val
      cb(details)
    })
  })
}
import firebase from 'firebase'
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import {createOrGetUser, checkIfUserExists, getCustomTokenAndKey} from '../lambda'
const FBSDK = require('react-native-fbsdk')
const {AccessToken} = FBSDK

/**
  * (1) Get Facebook access token
  * (2) Get Facebook user data via Graph API
  *     (2.5) Hit checkIfUserExists Lambda endpoint. If they do not, stop
  *     invocation and return incomplete Facebook user data to caller for
  *     onboarding completion
  * (3) Get Facebook login credential from Firebase
  * (4) Sign in to Firebase with Facebook login credential
  * (5) Hit user creation Lambda endpoint
  * (6) Return user data to caller
**/
function loginWithFacebook(callbacks) {
  let {onNewUserDetection, onSuccess, onFailure} = callbacks
  let facebookUserData

  // Get Facebook access token

  // Get Facebook user data
  // Login to Firebase with Facebook accessToken

  // Check if this is the user's first time logging in
  //   --> if yes, invoke onNewUserDetection callback and stop invocation
  //   --> if no, continue invocation

  // Get a customToken and key for Firebase's login with customToken

  AccessToken.getCurrentAccessToken().then((accessData) => {
    getFacebookUserData(accessData.accessToken, (facebookUserData) => {
      loginWithFacebookAccessToken(accessData.accessToken, (firebaseUserData) => {
        getCustomTokenAndKey(firebaseUserData.token, null, (customTokenData) => {
          console.log("Custom token data:", customTokenData)
          // checkIfUserExists(params, (userExistenceData) => {
          //   console.log("User existence data:", userExistenceData)
          // })
        })
      })
    })
  })

      // checkIfUserExists(facebookUserData.facebook_id, (userExists) => {
      //   console.log("userExists response:", userExists)
      //   if (userExists === false) {
      //     onNewUserDetection()
      //   } else {
      //     let FacebookAuth = firebase.auth.FacebookAuthProvider
      //     let cred = FacebookAuth.credential(accessData.accessToken)
      //     firebase.auth().signInWithCredential(cred)
      //     .then((user) => {
      //       let firebaseUserData = user.toJSON()
      //       firebaseUserData.token = firebaseUserData.stsTokenManager.accessToken
      //       createOrGetUser(firebaseUserData, (userData) => {
      //         if (userData) onSuccess(userData)
      //         else onFailure()
      //       })
      //     })
      //     .catch((err) => onFailure(err))
      //   }
      // })
}

/**
  *   Given a Facebook accessToken, fetch this user's Facebook user data and
  *   return it to caller
**/
function getFacebookUserData(token, cb) {
  let graphParams = '/me/?fields=email,age_range,first_name,last_name,gender,picture,friends&type=square'

  let graphRequest = new GraphRequest(graphParams, null, (err: ?Object, result: ?Object) => {
    if (err) onFailure(err)
    else onSuccess(result)
  })

  new GraphRequestManager().addRequest(graphRequest).start()

  function onSuccess(result) {
    cb({
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      phone: result.phone,
      gender: result.gender,
      friends: result.friends,
      token: result.token,
      facebook_id: result.id,
      profile_pic: (result.picture.data.is_silhouette) ? "" : result.picture.data.url
    })
  }

  function onFailure(err) {
    cb(err)
  }
}

/**
  *   Given a Facebook accessToken, get a Firebase login credential, login,
  *   and return Firebase user data to caller
**/
function loginWithFacebookAccessToken(accessToken, cb) {
  let FacebookAuth = firebase.auth.FacebookAuthProvider
  let cred = FacebookAuth.credential(accessToken)

  firebase.auth().signInWithCredential(cred).then((user) => {
    let firebaseUserData = user.toJSON()
    firebaseUserData.token = firebaseUserData.stsTokenManager.accessToken
    cb(firebaseUserData)
  })
  .catch((err) => {console.log(err); cb(null)})
}

module.exports = loginWithFacebook

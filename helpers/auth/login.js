import firebase from 'firebase'
import {createOrGetUser, checkIfUserExists, getCustomTokenAndKey} from '../lambda'
const FBSDK = require('react-native-fbsdk')
const {AccessToken} = FBSDK

function login(params) {
  let {
    mode,
    facebookUser,
    onSuccess,
    onFailure
  } = params

  // Declare login function var
  let login

  // Initialize login function depending on login mode
  switch (mode) {
    case "facebook": login = (cb) => loginFacebook(cb); break;
    default: login = () => onFailure()
  }

  /**
    *   (1) Use firebaseUser's accessToken to get a customToken and key
    *   (2) Login with customToken
    *   (3) Fetch user details from firebase database
    *   (4) Attach customToken and key to user details
    *   (5) Return user details to caller
  **/
  login((firebaseUser, err) => {
    if (err) {
      onFailure({errCode: err.code})
      return
    }

    if (!firebaseUser) {
      onFailure({errCode: "null-user"})
      return
    }

    getCustomTokenAndKey(firebaseUser.stsTokenManager.accessToken, null, (res) => {
      firebase.auth().signInWithCustomToken(res.customToken)
      .then((response) => response.toJSON())
      .then((responseData) => {
        let {customToken, key} = res
        let formattedUser = {
          name: firebaseUser.displayName,
          phone: facebookUser.phone,
          email: facebookUser.email,
          friends: facebookUser.friends.data,
          facebookID: facebookUser.facebook_id,
          profilePic: facebookUser.profile_pic,
          token: responseData.stsTokenManager.accessToken,
          key: key
        }

        createOrGetUser(formattedUser, (response) => {
          if (response) onSuccess(response)
          else onFailure(response)
        })
      })
      .catch((err) => {
        console.log(err)
        onFailure(err)
      })
    })
  })
}

/**
  *   (1) Create firebase facebook credential using facebook access token
  *   (2) Call firebase auth's signInWithCredential
  *   (3) Return firebaseUser to caller
**/
function loginFacebook(cb) {
  AccessToken.getCurrentAccessToken().then((res) => {
    let facebookAccessToken = res.accessToken
    let FacebookAuth = firebase.auth.FacebookAuthProvider
    let cred = FacebookAuth.credential(facebookAccessToken)

    firebase.auth().signInWithCredential(cred)
    .then((user) => cb(user.toJSON(), null))
    .catch((err) => {
      console.log(err)
      cb(null, err)
    })
  })
}

module.exports = login

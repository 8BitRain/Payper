import firebase from 'firebase'
import {createOrGetUser, checkIfUserExists, getCustomTokenAndKey} from '../lambda'
const FBSDK = require('react-native-fbsdk')
const {AccessToken} = FBSDK

function loginWithNewUserDetection(params) {
  let {
    mode,
    facebookUserData,
    facebookAccessToken,
    onSuccess,
    onFailure,
    onNewUserDetection
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
    *   (3) Check if this is the user's first time logging in
    *       --> if yes, stop invocation and onboard missing contact info
    *       --> if no, proceed
    *   (4) Fetch user details from firebase database
    *   (5) Attach customToken and key to user details
    *   (6) Return user details to caller
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

    getCustomTokenAndKey(firebaseUser.token, null, (res) => {
      firebase.auth().signInWithCustomToken(res.customToken)
      .then((response) => response.toJSON())
      .then((responseData) => {
        let customToken = responseData.stsTokenManager.accessToken
        let key = responseData.key

        checkIfUserExists({
          facebook_id: firebaseUser.facebookID,
          token: customToken
        }, (userExists) => {
          if (false === userExists) {
            onNewUserDetection(firebaseUser)
          } else if (true === userExists) {
            firebaseUser.token = customToken
            firebaseUser.key = key
            createOrGetUser(firebaseUser, () => {
              onSuccess(firebaseUser)
            })
          } else {
            onFailure()
          }
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
function loginFacebook(facebookAccessToken, cb) {
  let FacebookAuth = firebase.auth.FacebookAuthProvider
  let cred = FacebookAuth.credential(facebookAccessToken)

  firebase.auth().signInWithCredential(cred).then((user) => {
    let firebaseUserData = user.toJSON()
    let formattedUserData = {
      name: firebaseUserData.displayName,
      email: firebaseUserData.email,
      token: firebaseUserData.stsTokenManager.accessToken,
      phone: facebookUserData.phone,
      facebookID: facebookUserData.facebook_id,
      friends: facebookUserData.friends.data,
      profilePic: facebookUserData.profile_pic
    }

    cb(formattedUserData, null)
  })
  .catch((err) => {
    console.log(err)
    cb(null, err)
  })
}

module.exports = loginWithNewUserDetection

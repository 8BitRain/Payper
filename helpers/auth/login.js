import firebase from 'firebase'
import {createOrGetUser, checkIfUserExists, getCustomTokenAndKey} from '../lambda'
const FBSDK = require('react-native-fbsdk')
const {AccessToken} = FBSDK

function login(params) {
  let {
    mode,
    cachedUser,
    facebookUser,
    onSuccess,
    onFailure,
    onNewUserDetection
  } = params

  // Declare login function var
  let login

  // Initialize login function depending on login mode
  switch (mode) {
    case "facebook": login = (cb) => loginWithFacebook(cb); break;
    case "cache": login = (cb) => cb(cachedUser, null); break;
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

    getCustomTokenAndKey(firebaseUser.token || firebaseUser.stsTokenManager.accessToken, firebaseUser.key || null, (res) => {
      if (!res) {
        onFailure(`getCustomTokenAndKey response: ${res}`)
        return
      }

      firebase.auth().signInWithCustomToken(res.customToken)
      .then((response) => response.toJSON())
      .then((responseData) => {
        let {customToken, key} = res

        // User data is cached. Attach fresh customToken and key and return
        // user data to caller
        if ("cache" === mode) {
          cachedUser.token = responseData.stsTokenManager.accessToken
          cachedUser.key = key
          onSuccess(cachedUser)
          return
        }

        checkIfUserExists({
          facebookID: facebookUser.facebook_id,
          token: customToken
        }, (userExistsResponse) => {
          let formattedUser = {
            firstName: facebookUser.first_name,
            lastName: facebookUser.last_name,
            name: firebaseUser.displayName,
            phone: facebookUser.phone,
            email: facebookUser.email,
            gender: facebookUser.gender,
            dateOfBirth: facebookUser.birthday,
            friends: facebookUser.friends.data,
            facebookID: facebookUser.facebook_id,
            profilePic: facebookUser.profile_pic,
            token: responseData.stsTokenManager.accessToken,
            // customerType: "Document",
            key: key
          }

          // Return user data to caller and onboarding missing info. User
          // creation is handled in scenes/FacebookLoginModal
          if (false === userExistsResponse) {
            onNewUserDetection(formattedUser)
            return
          }

          // Get existing user's data and return it to caller. App
          // initialization is handled in scenes/Lander
          if (true === userExistsResponse) {
            createOrGetUser(formattedUser, (response) => {
              if (null === response || response.errorMessage || response.message)
                onFailure(response)
              else
                onSuccess(response)
            })

            return
          }

          // users/checkFacebook response is neither true nor false
          onFailure()
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
function loginWithFacebook(cb) {
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

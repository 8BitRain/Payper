import firebase from 'firebase'
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import {createOrGetUser, checkIfUserExists} from '../lambda'
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
function loginWithFacebook(params) {
  let {onNewUserDetection, onSuccess, onFailure} = params
  AccessToken.getCurrentAccessToken().then((accessData) => {
    requestFacebookUserData(accessData.accessToken, (facebookUserData) => {
      checkIfUserExists(facebookUserData.facebook_id, (userExists) => {
        if (!userExists) {
          onNewUserDetection()
        } else {
          let FacebookAuth = firebase.auth.FacebookAuthProvider
          let cred = FacebookAuth.credential(accessData.accessToken)
          firebase.auth().signInWithCredential(cred)
          .then((user) => {
            let firebaseUserData = user.toJSON()
            firebaseUserData.token = firebaseUserData.stsTokenManager.accessToken
            createOrGetUser(firebaseUserData, (userData) => onSuccess(userData))
          })
          .catch((err) => onFailure(err))
        }
      })
    })
  })
}

function requestFacebookUserData(token, cb) {
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

module.exports = loginWithFacebook

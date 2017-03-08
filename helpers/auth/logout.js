import {Actions} from 'react-native-router-flux'
import {FBLoginManager} from 'NativeModules'
import firebase from 'firebase'

function logout(currentUser) {
  Actions.Lander({type: 'reset'})
  firebase.auth().signOut()
  FBLoginManager.logOut()
  currentUser.destroy()
}

module.exports = logout

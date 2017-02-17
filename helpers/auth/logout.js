import {Actions} from 'react-native-router-flux'
import {FBLoginManager} from 'NativeModules'
import firebase from 'firebase'

function logout(currentUser) {
  Actions.Lander()
  firebase.auth().signOut()
  FBLoginManager.logOut()
  currentUser.destroy()
}

module.exports = logout

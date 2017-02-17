import React from 'react'
import firebase from 'firebase'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {FBLoginManager} from 'NativeModules'
import {loginWithFacebook} from '../helpers/auth'

const FBSDK = require('react-native-fbsdk')
const {LoginButton} = FBSDK
const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  },
  loginButton: {
    width: dims.width - 60,
    height: 45,
    marginTop: 20
  }
})

class Lander extends React.Component {
  constructor(props) {
    super(props)
    this.onLoginFinished = this.onLoginFinished.bind(this)
  }

  onLoginFinished(err, res) {
    if (err || res.isCancelled) {
      // TODO: Handle login failure
      return
    }

    loginWithFacebook({
      onNewUserDetection: (userData) => {
        console.log("New user detected. User data:", userData)
      },
      onSuccess: (userData) => {
        console.log("Logged in with Facebook! User data:", userData)
      },
      onFailure: (err) => {
        console.log("Facebook login failed. Error:", err)
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{'Welcome to Payper'}</Text>
        <LoginButton style={styles.loginButton} readPermissions={["email", "public_profile", "user_friends"]} onLoginFinished={this.onLoginFinished} />
        <Button onPress={Actions.Main} style={{margin: 10}}>{"Bypass Login"}</Button>
      </View>
    )
  }
}

module.exports = Lander

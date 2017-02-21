import React from 'react'
import firebase from 'firebase'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {FBLoginManager} from 'NativeModules'
import {login, getFacebookUserData} from '../helpers/auth'
import {colors} from '../globalStyles'

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
  },
  loadingModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.accent
  }
})

class Lander extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.onLogin = this.onLogin.bind(this)
  }

  onLogin(err, res) {
    if (err) {
      alert("Something went wrong on our end. Please try again later.")
      return
    }

    if (res.isCancelled) {
      return
    }

    this.setState({loading: true})

    getFacebookUserData({
      onSuccess: (userData) => {
        Actions.FacebookLogin({userData})
        this.setState({loading: false})
      },
      onFailure: () => {
        alert("Something went wrong on our end. Please try again later.")
        this.setState({loading: false})
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{'Welcome to Payper'}</Text>
        <LoginButton style={styles.loginButton} readPermissions={["email", "public_profile", "user_friends"]} onLoginFinished={this.onLogin} />
        <Button onPress={Actions.Main} style={{margin: 10}}>{"Bypass Login"}</Button>
        {(this.state.loading) ? <View style={styles.loadingModal} /> : null}
      </View>
    )
  }
}

module.exports = Lander

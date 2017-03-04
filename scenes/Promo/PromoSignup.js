import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {getFacebookUserData} from '../../helpers/auth'
import {setInAsyncStorage} from '../../helpers/asyncStorage'

const FBSDK = require('react-native-fbsdk')
const {LoginButton} = FBSDK
const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  }
})

class PromoSignup extends React.Component {
  onLoginFinished(err, res) {
    if (err) { onFailure(); return }
    if (res.isCancelled) return

    getFacebookUserData({
      onFailure,
      onSuccess: (facebookUserData) => {
        Actions.FacebookLogin({
          userData: facebookUserData,
          destination: (userData) => {
            setInAsyncStorage('userData', JSON.stringify(userData))
            Actions.PromoWaitingRoom({userData})
          }
        })
      }
    })

    function onFailure() {
      alert("Something went wrong on our end. Please try again later.")
    }
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Facebook Login Button */ }
        <LoginButton
          style={{width: dims.width - 60, height: 45}}
          readPermissions={["email", "public_profile", "user_friends"]}
          onLoginFinished={(err, res) => this.onLoginFinished(err, res)} />

        { /* Back it up */ }
        <Button onPress={Actions.pop}>
          {"Back"}
        </Button>

      </View>
    )
  }
}

module.exports = PromoSignup

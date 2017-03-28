import React from 'react'
import {View, StyleSheet, Dimensions, Image, Text} from 'react-native'
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
  },
  subscriptionLogo: {
    width: dims.width * 0.3,
    height: dims.width * 0.3,
    borderRadius: (dims.width * 0.3) / 2,
    borderWidth: 3,
    borderColor: colors.lightGrey
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: dims.width
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

        { /* Subscription Logo */ }
        <Image
          style={styles.subscriptionLogo}
          source={require('../../assets/images/logos/netflix.png')} />

        { /* Spacer */ }
        <View style={{height: 20}} />

        { /* More info */ }
        <View style={{width: dims.width - 60, padding: 16, borderRadius: 4, borderColor: colors.medGrey, borderWidth: 1}}>
          <Text style={{fontSize: 20, fontWeight: '600', color: colors.deepBlue, backgroundColor: 'transparent'}}>
            {"Great choice!"}
          </Text>

          { /* Spacer */ }
          <View style={{height: 4}} />
          
          <Text style={{fontSize: 18, fontWeight: '400', color: colors.deepBlue, backgroundColor: 'transparent'}}>
            {"Log in via Facebook and we'll notify you with your complimentary subscription when Payper launches."}
          </Text>
        </View>

        { /* Spacer */ }
        <View style={{height: 14}} />

        { /* Facebook Login Button */ }
        <LoginButton
          style={{width: dims.width - 60, height: 45}}
          readPermissions={["email", "public_profile", "user_friends"]}
          onLoginFinished={(err, res) => this.onLoginFinished(err, res)} />

      </View>
    )
  }
}

module.exports = PromoSignup

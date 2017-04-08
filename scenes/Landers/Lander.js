import React from 'react'
import firebase from 'firebase'
import {View, Text, StyleSheet, Dimensions, StatusBar, Image, Alert, Linking} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {FBLoginManager} from 'NativeModules'
import {login, getFacebookUserData} from '../../helpers/auth'
import {colors} from '../../globalStyles'
import {connect} from 'react-redux'
import Button from 'react-native-button'
import Hyperlink from 'react-native-hyperlink'
import * as dispatchers from '../Main/MainState'

const FBSDK = require('react-native-fbsdk')
const {LoginButton} = FBSDK
const dims = Dimensions.get('window')
const logoAspectRatio = 377 / 568
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite,
    paddingTop: 20
  },
  loginButton: {
    width: dims.width - 60,
    height: 45,
    marginTop: 20
  },
  loadingModal: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.snowWhite
  }
})

class Lander extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.onLogin = this.onLogin.bind(this)
    this.handleURLClick = this.handleURLClick.bind(this)
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
        login({
          mode: "facebook",
          facebookUser: userData,
          onSuccess: (response) => {
            this.setState({loading: false})
            this.props.currentUser.initialize(response.user)
            Actions.Main()
          },
          onFailure: (err) => {
            Alert.alert('Sorry...', 'Something went wrong. Please try again later.')
            this.setState({loading: false})
            FBLoginManager.logOut()
          },
          onNewUserDetection: (firebaseUserData) => {
            this.setState({loading: false})
            Actions.FacebookLogin({userData: firebaseUserData})
          }
        })
      },
      onFailure: () => {
        alert("Something went wrong on our end. Please try again later.")
        this.setState({loading: false})
      }
    })
  }

  handleURLClick(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        { /* Logo */ }
        <Image source={require('../../assets/images/logo.png')} style={{height: dims.width * 0.22, width: (dims.width * 0.22) * logoAspectRatio}} />

        { /* Welcome Message */ }
        <Text style={{fontWeight: '500', fontSize: 26, color: colors.accent, textAlign: 'center', width: dims.width - 80, marginTop: 20}}>
          {"Welcome to Payper"}
        </Text>
        <Text style={{fontSize: 18, color: colors.accent, textAlign: 'center', width: dims.width - 80}}>
          {"Find and share subscriptions with friends"}
        </Text>

        { /* Facebook Login Button */ }
        <LoginButton style={styles.loginButton} readPermissions={["email", "public_profile", "user_friends"]} onLoginFinished={this.onLogin} />

        { /* NOTE: Uncomment to bypass login
          <Button onPress={Actions.Main}>{"Skip Login"}</Button>
        */ }

        { /* Filler */ }
        <View style={{height: 70}} />

        { /* Footer */ }
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'flex-end', padding: 15}}>
          <Hyperlink
            onPress={(url) => this.handleURLClick(url)}
            linkStyle={{color:'#2980b9', fontSize:14}}
            linkText={(url) => {
              if (url === 'https://www.getpayper.io/terms') return 'Terms of Service'
              if (url === 'https://www.getpayper.io/privacy') return 'Privacy Policy'
            }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: colors.deepBlue, fontWeight: '100' }}>
              {"By creating an account or logging in, you agree to Payper's https://www.getpayper.io/terms and https://www.getpayper.io/privacy."}
            </Text>
          </Hyperlink>
        </View>

        { /* Loading Modal */
          (this.state.loading)
            ? <View style={styles.loadingModal}>
                <Image source={require('../../assets/images/loading.gif')} style={{width: 60, height: 90, backgroundColor: 'transparent'}} />
              </View>
            : null}
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Lander)

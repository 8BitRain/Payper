// Dependencies
import React from 'react'
import { View, ScrollView, Text, TouchableHighlight, Modal, Animated, Easing, Dimensions, Linking, StatusBar, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Mixpanel from 'react-native-mixpanel'
const FBSDK = require('react-native-fbsdk')
const { LoginButton, AccessToken } = FBSDK
import { FBLoginManager } from 'NativeModules'
import { signin, requestFacebookUserData } from '../../auth'

// Helpers
import * as Lambda from '../../services/Lambda'

// Components
import UserOnboardingView from '../../modules/UserOnboarding/UserOnboardingView'
import PaymentCards from './subcomponents/PaymentCards'
import LoginModal from '../../components/LoginModal/LoginModal'

// Stylesheets
import colors from '../../styles/colors'
import typography from './styles/typography'
import container from './styles/container'
const dimensions = Dimensions.get('window')

export default class LandingScreenView extends React.Component {
  constructor(props) {
    super(props)
    this.loadingOpacity = new Animated.Value(0)
    this.logoAspectRatio = 377 / 568
    this.logoTextAspectRatio = 402 / 104
    this.state = {
      headerHeight: 0,
      loginModalVisible: false,
      signUpModalVisible: false,
      loading: false
    }
  }

  toggleLoginModal() {
    this.setState({ loginModalVisible: !this.state.loginModalVisible });
  }

  toggleLoadingScreen() {
    this.setState({ loading: !this.state.loading });
    Animated.timing(this.loadingOpacity, {
      toValue: (this.loadingOpacity._value === 0) ? 1.0 : 0.0,
      duration: 325
    }).start();
  }

  toggleSignUpModal() {
    this.setState({ signUpModalVisible: !this.state.signUpModalVisible })
  }

  onGenericLoginSuccess() {
    let appFlags = this.props.currentUser.appFlags
    if (appFlags && appFlags.onboarding_state === "customer") {
      Actions.BankOnboardingView({ currentUser: this.props.currentUser })
    } else {
      Actions.MainViewContainer()
    }
  }

  signinWithFacebook(userData) {
    let { token } = userData
    this.toggleLoadingScreen()

    signin({
      type: "facebook",
      facebookToken: token
    }, (user) => {
      if (user) {
        this.props.currentUser.initialize(user)

        if (user.appFlags.onboarding_state === 'customer') {
          Actions.BankOnboardingView({
            currentUser: this.props.currentUser,
            emailFromFacebook: emailFromFacebook,
            phoneFromFacebook: phoneFromFacebook,
            onboardEmail: true,
            onboardPhone: true
          })
        } else {
          Actions.MainViewContainer()
        }
      } else {
        alert("Something went wrong. Please try again later.")
        FBLoginManager.logOut()
        this.toggleLoadingScreen()
      }
    })
  }

  render() {
    return (
      <Animated.View style={{ flex: 1.0, backgroundColor: colors.richBlack, opacity: this.pageWrapOpacity, paddingTop: 20 }}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Header */ }
        <View onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})} style={{flex: 0.1, width: dimensions.width, flexDirection: 'row'}}>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.6, width: (this.state.headerHeight * 0.6) * this.logoAspectRatio }} />
          </View>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'flex-end'}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.toggleLoginModal()}>
              <Text style={{fontSize: 16, color: colors.white, fontWeight: '300', padding: 20}}>
                {"Sign in"}
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        { /* Payment cards */ }
        <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.mintCream }}>
          <ScrollView>
            {/*<PaymentCards />*/}
            <View style={{ height: dimensions.height * 0.2, width: dimensions.width, backgroundColor: colors.mintCream }} />
          </ScrollView>
        </View>

        { /* Footer */ }
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: dimensions.height * 0.2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
          <LoginButton
            style={{width: dimensions.width - 60, height: 45 }}
            readPermissions={["email", "public_profile", "user_friends"]}
            onLoginFinished={(err, res) => {
              if (err) {
                alert("Something went wrong. Please try again later.")
                Mixpanel.trackWithProperties('Failed Facebook Signin', { err: err })
              } else if (res.isCancelled) {
                Mixpanel.trackWithProperties('Cancelled Facebook Signin')
              } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                  requestFacebookUserData(data.accessToken, (userData) => {
                    this.signinWithFacebook(userData)
                  })
                })
              }
            }} />

          { /* 'Continue without Facebook' button */ }
          <TouchableHighlight
            style={{ paddingTop: 10 }}
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => Actions.UserOnboardingViewContainer()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontFamily: 'Roboto', color: colors.white, fontSize: 18, fontWeight: '100' }}>
                {"or "}
              </Text>
              <Text style={{ fontFamily: 'Roboto', color: colors.accent, fontSize: 18, fontWeight: '100' }}>
                {"sign up with email"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        { /* Non-Facebook login modal */ }
        <LoginModal
          {...this.props}
          modalVisible={this.state.loginModalVisible}
          toggleModal={() => this.toggleLoginModal()}
          onLoginSuccess={() => this.onGenericLoginSuccess()} />

        { /* Generic sign up modal */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.signUpModalVisible}>

          <UserOnboardingView
            handleCancel={() => this.toggleSignUpModal()}
            updateCurrentUser={this.props.updateCurrentUser}
            currentUser={this.props.currentUser} />

        </Modal>

        { /* Facebook login loading view */
        (this.state.loading)
          ? <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.richBlack, opacity: this.loadingOpacity, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
                Logging in...
              </Text>
            </Animated.View>
          : null }
      </Animated.View>
    )
  }
}

// Dependencies
import React from 'react'
import { View, ScrollView, Text, TouchableHighlight, Modal, Animated, Easing, Dimensions, Linking, StatusBar, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Mixpanel from 'react-native-mixpanel'
import Hyperlink from 'react-native-hyperlink'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const FBSDK = require('react-native-fbsdk')
const { LoginButton, AccessToken } = FBSDK
import { FBLoginManager } from 'NativeModules'
import { signin, requestFacebookUserData } from '../../auth'
import CodePush from 'react-native-code-push';

// Helpers
import * as Lambda from '../../services/Lambda'

// Components
import UserOnboardingView from '../../modules/UserOnboarding/UserOnboardingView'
import PaymentCards from './subcomponents/PaymentCards'
import LoginModal from '../../components/LoginModal/LoginModal'

// Stylesheets
const dims = Dimensions.get('window')
import { colors } from '../../globalStyles'
import typography from './styles/typography'
import container from './styles/container'

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

  handleURLClick = (url) =>{
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
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
    Actions.MainViewContainer({type: 'replace'})
  }

  signinWithFacebook(userData) {
    let { token, email, phone } = userData

    signin({
      type: "facebook",
      facebookToken: token,
      facebookUserData: userData
    }, (user, isNewUser) => {
      // Something went wrong; User JSON is non-existent
      if (!user) {
        alert("Something went wrong. Please try again later.")
        FBLoginManager.logOut()
        this.toggleLoadingScreen()
        return
      }

      // Success! Initialize user object and progress to next view
      this.props.currentUser.initialize(user)
      if (true === isNewUser) Actions.FirstPaymentView()
      else Actions.MainViewContainer()
    })
  }

  render() {
    return (
      <Animated.View style={{flex: 1.0, backgroundColor: colors.snowWhite, opacity: this.pageWrapOpacity, paddingTop: 20}}>
        <StatusBar barStyle="default" />

        <View style={{flex: 1.0, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1.0, justifyContent: 'flex-end', alignItems: 'center'}}>
            { /* Logo */ }
            <Image source={require('../../assets/images/logo.png')} style={{height: dims.width * 0.22, width: (dims.width * 0.22) * this.logoAspectRatio}} />

            { /* Welcome message */ }
            <Text style={{fontWeight: '500', fontSize: 26, color: colors.accent, width: dims.width - 80, marginTop: 20}}>
              {"Welcome to Payper,"}
            </Text>
            <Text style={{fontSize: 18, color: colors.accent, width: dims.width - 80}}>
              {"the app that makes recurring payments easy."}
            </Text>
          </View>


          <View style={{flex: 1.0, justifyContent: 'center', alignItems: 'center'}}>
            { /* "Sign in with Facebook" button */ }
            <LoginButton
              style={{width: dims.width - 60, height: 45, marginTop: 20}}
              readPermissions={["email", "public_profile", "user_friends"]}
              onLoginFinished={(err, res) => {
                if (err) {
                  console.log("Facebook login failed...", JSON.stringify(err));
                } else if (res.isCancelled) {
                  console.log("Facebook login was cancelled...");
                } else {
                  this.toggleLoadingScreen()
                  AccessToken.getCurrentAccessToken().then((data) => {
                    requestFacebookUserData(data.accessToken, (userData) => {
                      this.signinWithFacebook(userData)
                    })
                  })
                }
              }} />

            { /* "Sign up with email" button */ }
            <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={() => Actions.UserOnboardingViewContainer()}>
              <View style={{width: dims.width - 60, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 4, marginTop: 6}}>
                <Text style={{fontSize: 16, color: colors.snowWhite}}>
                  {"Sign up with email"}
                </Text>
              </View>
            </TouchableHighlight>

            { /* "Sign in with email" button */ }
            <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={this.toggleLoginModal.bind(this)}>
              <View style={{width: dims.width - 60, height: 45, justifyContent: 'flex-start', alignItems: 'center', borderRadius: 4, marginTop: 6, paddingTop: 6}}>
                <Text style={{fontSize: 16, color: colors.deepBlue}}>
                  {"Sign in with email"}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

        { /* Footer */ }
        <View style={{alignItems: 'center', justifyContent: 'flex-end', padding: 15}}>
          <Hyperlink
            onPress={(url) => this.handleURLClick(url)}
            linkStyle={{color:'#2980b9', fontSize:14}}
            linkText={(url) => {
              if (url === 'https://www.getpayper.io/terms')
                return 'Terms of Service';
              else if (url === 'https://www.getpayper.io/privacy')
                return 'Privacy Policy';
            }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: colors.deepBlue, fontWeight: '100' }}>
              { "By creating an account or logging in, you agree to Payper's https://www.getpayper.io/terms and https://www.getpayper.io/privacy." }
            </Text>
          </Hyperlink>
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
          ? <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.accent, opacity: this.loadingOpacity, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <EvilIcons name={"spinner"} color={colors.snowWhite} size={32} />
            </Animated.View>
          : null }
      </Animated.View>
    )
  }
}

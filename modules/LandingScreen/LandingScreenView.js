// Dependencies
import React from 'react';
import { View, ScrollView, Text, TouchableHighlight, Modal, Animated, Easing, Dimensions, Linking, StatusBar, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Hyperlink from 'react-native-hyperlink';
const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, GraphRequest, GraphRequestManager } = FBSDK;

// Helpers
import * as Lambda from '../../services/Lambda';

// Components
import UserOnboardingView from '../../modules/UserOnboarding/UserOnboardingView';
import PaymentCards from './subcomponents/PaymentCards';
import LoginModal from '../../components/LoginModal/LoginModal';

// Stylesheets
import colors from '../../styles/colors';
import typography from './styles/typography';
import container from './styles/container';
const dimensions = Dimensions.get('window');

export default class LandingScreenView extends React.Component {
  constructor(props) {
    super(props);
    this.loadingOpacity = new Animated.Value(0);
    this.logoAspectRatio = 377 / 568;
    this.logoTextAspectRatio = 402 / 104;
    this.state = {
      headerHeight: 0,
      loginModalVisible: false,
      signUpModalVisible: false,
      loading: false
    };
  }

  loginWithFacebook(token) {
    const _this = this;
    this.toggleLoadingScreen();

    // Query the Facebook SDK
    var req = new GraphRequest('/me/?fields=email,age_range,first_name,last_name,gender,picture,friends&type=square', null, (err: ?Object, result: ?Object) => {
      if (err) {
        alert("Something went wrong 🙄\nPlease try again");
        _this.toggleLoadingScreen();
        console.log("%cError getting Facebook user data...", "color:red;font-weight:900;");
        console.log(err);
      } else {
        if (!result.email) alert("Facebook did not return an email address.");

        // Re-structure Facebook user data
        var userData = {
          facebookToken: token,
          user: {
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            profile_pic: (result.picture.data.is_silhouette) ? "" : result.picture.data.url,
            phone: "",
            gender: result.gender,
            friends: result.friends.data,
            facebook_id: result.id,
            token: ""
          }
        };

        _this.props.currentUser.loginWithFacebook(userData,
          (res) => {

            var emailFromFacebook = userData.user.email,
                phoneFromFacebook = userData.user.phone;

            if (res.appFlags.onboarding_state === 'customer') {

              // Onboarding Dwolla customer info and email/phone
              Actions.BankOnboardingView({
                currentUser: _this.props.currentUser,
                emailFromFacebook: emailFromFacebook,
                phoneFromFacebook: phoneFromFacebook,
                onboardEmail: true,
                onboardPhone: true
              });

            } else {

              // Go to app
              _this.onLoginSuccess();

            }
          },
          () => {
            alert("Facebook login failed. Please try again later.");
            _this.toggleLoadingScreen();
          });
      }
    });

    new GraphRequestManager().addRequest(req).start();
  }

  handleURLClick = (url) =>{
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  toggleLoginModal() {
    this.setState({ loginModalVisible: !this.state.loginModalVisible });
  }

  toggleSignUpModal() {
    this.setState({ signUpModalVisible: !this.state.signUpModalVisible });
  }

  toggleLoadingScreen() {
    this.setState({ loading: !this.state.loading });
    Animated.timing(this.loadingOpacity, {
      toValue: (this.loadingOpacity._value === 0) ? 1.0 : 0.0,
      duration: 325
    }).start();
  }

  onLoginSuccess() {
    console.log("Login succeeded...");
    console.log("Current user:", this.props.currentUser);
    let appFlags = this.props.currentUser.appFlags;
    if (appFlags && appFlags.onboarding_state === "customer") {
      Actions.BankOnboardingView({ currentUser: this.props.currentUser });
    } else {
      Actions.MainViewContainer();
    }
  }

  render() {
    return (
      <Animated.View style={{ flex: 1.0, backgroundColor: colors.gainsboroEdit, opacity: this.pageWrapOpacity, paddingTop: 20 }}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Header */ }
        <View onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})} style={{flex: 0.1, width: dimensions.width, flexDirection: 'row'}}>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../assets/images/Payper_logo_turqouise.png')} style={{ height: this.state.headerHeight * 1.4, width: (this.state.headerHeight * 1.4) * this.logoAspectRatio }} />
          </View>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'flex-end'}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.toggleLoginModal()}>
              <Text style={{fontSize: 18, color: colors.carribeanGreen, fontWeight: '500', padding: 20, fontFamily: "Lato"}}>
                {"Sign in"}
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        { /* Payment cards */ }
        <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 0, paddingTop: 10, backgroundColor: colors.gainsboroEdit }}>
          <ScrollView>
            <PaymentCards key={"preventsRerender"} />
            <View style={{ height: dimensions.height * 0.2, width: dimensions.width, backgroundColor: colors.gainsboroEdit }} />
          </ScrollView>
        </View>

        { /* Footer */ }
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: dimensions.height * 0.2, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gainsboroEdit }}>
          <LoginButton
            style={{width: dimensions.width - 60, height: 45 }}
            readPermissions={["email", "public_profile", "user_friends"]}
            onLoginFinished={(err, res) => {
              if (err) {
                console.log("Facebook login failed...", JSON.stringify(err));
              } else if (res.isCancelled) {
                console.log("Facebook login was cancelled...");
              } else {
                const _this = this;
                AccessToken.getCurrentAccessToken().then((data) => _this.loginWithFacebook(data.accessToken));
              }
            }} />

          { /* 'Continue without Facebook' button */ }
          <TouchableHighlight
            style={{ paddingTop: 10 }}
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => Actions.UserOnboardingViewContainer()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontFamily: 'Lato', color: colors.gainsboroEdit, fontSize: 18, fontWeight: '500' }}>
                {"or "}
              </Text>
              <Text style={{ fontFamily: 'Roboto', color: colors.carribeanGreen, fontSize: 18, fontWeight: '500', fontFamily: "Lato" }}>
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
          onLoginSuccess={() => this.onLoginSuccess()} />

        { /* Facebook login loading view */
          (this.state.loading)
            ? <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.gainsboroEdit, opacity: this.loadingOpacity, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
                  {"Logging in..."}
                </Text>
              </Animated.View>
            : null }

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
      </Animated.View>
    );
  }
}

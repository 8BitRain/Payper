// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Modal, Animated, Easing, Dimensions, Linking, StatusBar, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Hyperlink from 'react-native-hyperlink';
const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, GraphRequest, GraphRequestManager } = FBSDK;

// Helpers
import * as Lambda from '../../services/Lambda';

// Components
import ImageCarousel from './subcomponents/ImageCarousel';
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
    this.state = {
      headerHeight: 0,
      loginModalVisible: false,
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
            console.log("Login with Facebook was a success. Here's the user object:\n", res);

            if (res.appFlags.onboarding_state === 'customer') {
              if (res.phone) {

                // Go to customer creation flow
                Actions.BankOnboardingView({ currentUser: _this.props.currentUser });

              } else {

                // Input phone number, then go to customer creation flow
                Actions.Phone({
                  showHeader: true,
                  currentUser: _this.props.currentUser,
                  nextPage: () => Actions.BankOnboardingView({ currentUser: _this.props.currentUser }),
                  induceState: (substate) => {
                    _this.props.currentUser.updatedPhone = substate.phone;
                    Lambda.updateUser({ token: _this.props.currentUser.token, user: _this.props.currentUser });
                  }
                });

              }
            } else if (!res.phone) {

              // Input phone number, then go to app
              Actions.Phone({
                showHeader: true,
                currentUser: _this.props.currentUser,
                nextPage: () => _this.onLoginSuccess(),
                induceState: (substate) => {
                  _this.props.currentUser.updatedPhone = substate.phone;
                  Lambda.updateUser({ token: _this.props.currentUser.token, user: _this.props.currentUser });
                }
              });

            } else {

              // Go to app
              _this.onLoginSuccess();

            }
          },
          () => {
            alert("Something went wrong 🙄\nPlease try again");
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
      <Animated.View style={{ flex: 1.0, backgroundColor: colors.richBlack, opacity: this.pageWrapOpacity }}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Title */ }
        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.25, width: (this.state.headerHeight * 0.25) * this.logoAspectRatio }} />
          <Text style={[typography.main, {fontSize: 28, paddingTop: 10, color: colors.white}]}>
            { "Welcome to" }
          </Text>
          <Text style={[typography.main, {fontSize: 32, color: colors.accent}]}>
            { "Payper" }
          </Text>
        </View>

        { /* Payment previews */ }
        <View style={[container.image, {flex: 0.3, justifyContent: 'flex-start', alignItems: 'flex-start',  borderColor: 'transparent', borderWidth: 0}]}>
          <ImageCarousel />
        </View>

        { /* Login buttons */ }
        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
          <LoginButton
            style={{width: dimensions.width - 50, height: 55, marginBottom: 10}}
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
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.toggleLoginModal()}>
              <Text style={{ fontFamily: 'Roboto', color: colors.white, fontSize: 16, fontWeight: '200' }}>
                Continue without Facebook
              </Text>
            </TouchableHighlight>
        </View>

        { /* Privacy Policy and TOS */ }
        <View style={{padding: 20, alignItems: "center"}}>
          <Hyperlink
            onPress={(url) => this.handleURLClick(url)}
            linkStyle={{color:'#2980b9', fontSize:14}}
            linkText={(url) => {
              if (url === 'https://www.getpayper.io/terms')
                return 'Terms of Service';
              else if (url === 'https://www.getpayper.io/privacy')
                return 'Privacy Policy';
            }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: colors.white, fontWeight: '100' }}>
              { "By creating an account or logging in, you agree to Payper's https://www.getpayper.io/terms and https://www.getpayper.io/privacy." }
            </Text>
          </Hyperlink>
        </View>

        { /* Non-Facebook login modal */ }
        <LoginModal
          {...this.props}
          modalVisible={this.state.loginModalVisible}
          toggleModal={() => this.toggleLoginModal()}
          onLoginSuccess={() => this.onLoginSuccess()} />

        { /* Facebook login loading view */
          (this.state.loading)
            ? <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.richBlack, opacity: this.loadingOpacity, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
                  Logging in...
                  </Text>
              </Animated.View>
            : null }
      </Animated.View>
    );
  }
}

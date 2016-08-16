import React from 'react';

import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, Linking, StatusBar} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import Hyperlink from 'react-native-hyperlink';
import * as Animations from "../../helpers/animations";
import FacebookLogin from "../../components/FacebookLogin";
import GenericSignUp from "../../components/GenericSignUp";
import GenericSignIn from "../../components/GenericSignIn";
import Loading from "../../components/Loading/Loading";

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  ShareDialog,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;

// Helpers
import * as Init from '../../_init';

// Stylesheets
import colors from '../../styles/colors';
import container from './styles/container';
import background from './styles/background';
import typography from './styles/typography';
import carousel from './styles/carousel';
var Mixpanel = require('react-native-mixpanel');

// Carousel component for image sliding
import Carousel from 'react-native-carousel';
var dimensions = Dimensions.get('window');

class ImageCarousel extends React.Component {
  render() {
    var imgWidth = dimensions.width - 50;
    var imgHeight = 165 / 350;
        imgHeight *= imgWidth;
    return (
      <Carousel hideIndicators={true} animate={true} delay={2750} width={dimensions.width}>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Eric.png')} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Mo.png')} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Brady.png')} />
        </View>
      </Carousel>
    );
  }
};

class LandingScreenDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
      fbPhone: false,
      provider: "",
      doneLoading: false,
      signInSuccess: false,
      fbAcessToken: "Test Value",
      fbUser: {}
    }

    this.animationProps = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };
  }


  componentDidMount() {
    Animations.fadeIn(this.animationProps);
    Mixpanel.sharedInstanceWithToken('507a107870150092ca92fa76ca7c66d6');
    Mixpanel.timeEvent("Landing Screen Duration");
  }


  onFBPress() {
    Mixpanel.track("FBLogin");
    Mixpanel.timeEvent("Completed signup");
    Mixpanel.track("Landing Screen Duration");
    Actions.TrackingContainer();
  }


  onGenericPress() {
    Mixpanel.track("GenericLogin");
    Mixpanel.timeEvent("Completed signup");
    Mixpanel.track("Landing Screen Duration");
    Actions.CreateAccountViewContainer();
  }


  /*
  * Query the FB Graph
  */
  fbAPIRequest() {
    const _this = this;

    // '...&type=square' specifies the image type we're retrieving
    // (other types include small, medium, large, and thumbnail)
    const infoRequest = new GraphRequest(
      '/me/?fields=email,age_range,first_name,last_name,gender,picture,friends&type=square',
      null,
      _this.responseInfoCallback.bind(this),
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }


  /*
  * Response from using the FB Graph
  */
  responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      this.signInWithFacebook(this.state.fbAcessToken, result);
    }
  }


  /*
  * Sign In With Facebook
  */
  signInWithFacebook(FBToken, result) {

    // Extend scope
    const _this = this;

    // Get profile picture
    var picture;
    if (result.picture.data.is_silhouette) picture = '';
    else picture = result.picture.data.url;

    // Set up user object
    var data = {
      FBToken: FBToken,
      user: {
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        profile_pic: picture,
        phone: '',
        gender: result.gender,
        friends: result.friends.data,
        facebook_id: result.id,
        token: ''
      }
    };

    // Critical line causing loading issues.
    this.setState({provider: "facebook"});

    // Start loading
    this.setState({loading: true});

    console.log("PROPS: " + this);

    // Push user object to Lambda function
    Init.signInWithFacebook(data, function(signedIn, user, token) {
        console.log("TOKEN: " + token);
        console.log("USER: " + JSON.stringify(user));
        if (!user.phone) {
          _this.props.dispatchSetProvider(_this.state.provider);
          _this.props.dispatchSetNewUserToken(token);
        }
        _this.setState({fbPhone: user.phone});
        _this.setState({provider: user.provider});
        _this.setState({doneLoading: true, signInSuccess: signedIn});
    });

  }

  handleUrlClick = (url) =>{
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }


  render() {
    if (this.state.loading) {
      //FacebookAccount Either null or Already Created
      if(this.state.provider == ""){
        console.log("LandingScreen: GENERIC ROUTE")
        return(
          <Loading
            complete={this.state.doneLoading}
            msgSuccess={"Welcome!"}
            msgError={"Sign in failed"}
            msgLoading={"Signing In"}
            success={this.state.signInSuccess}
            successDestination={() => Actions.MainViewContainer()}
            errorDestination={() => Actions.LandingScreenContainer()} />
        );
      }

      if(this.state.provider == "facebook"){
        console.log("FbPhone: " + this.state.fbPhone);
        if(this.state.fbPhone){
          console.log("LandingScreen: TO MainView");
          return(
            <Loading
              complete={this.state.doneLoading}
              msgSuccess={"Welcome!"}
              msgError={"Sign in failed"}
              msgLoading={"Signing in"}
              success={this.state.signInSuccess}
              successDestination={() => Actions.MainViewContainer()}
              errorDestination={() => Actions.LandingScreenContainer()} />
          );
        }
        //Facebook Account Newly Created
        if(!this.state.fbPhone){
          console.log("LandingScreen: TO CreateAccountViewContainer");
          return(
            <Loading
              complete={this.state.doneLoading}
              msgSuccess={"Welcome!"}
              msgError={"Sign in failed"}
              msgLoading={"Signing in"}
              success={this.state.signInSuccess}
              successDestination={() => Actions.CreateAccountViewContainer()}
              errorDestination={() => Actions.LandingScreenContainer()} />
          );
        }
      }

    } else {
      return (
        <Animated.View style={{flex: 1.0, backgroundColor: colors.richBlack, opacity: this.animationProps.fadeAnim}}>

          { /* Darken status bar text */ }
          <StatusBar barStyle="default" />

          <View style={[{flex: 0.2}, container.image]}>
            <Text style={[typography.main, typography.fontSizeTitle, {paddingTop: 45, color: colors.accent}]}>Payper</Text>
          </View>

          <View style={[container.image, {flex: 0.4}]}>
            <ImageCarousel />
          </View>

          <View style={{flex: 0.4, justifyContent: 'flex-start', alignItems: 'center'}}>
            <LoginButton
              style={{width: dimensions.width - 50, height: 53, marginBottom: 10}}
              readPermissions={["email","public_profile", "user_friends"]}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    // alert("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log("Grabbing Facebook AccesToken for User: " +
                         "\n" + "======+++++==========++++++======="
                         + "\n" + JSON.stringify(data));
                        this.state.fbAcessToken = data.accessToken;
                        this.fbAPIRequest();
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => { /* alert("logout.") */ }} />
            <GenericSignIn destination={Actions.SignInViewContainer}/>
            <GenericSignUp destination={Actions.CreateAccountViewContainer}/>
          </View>
          {/*TOS*/}
          <View style={{alignItems: "center"}}>
            <Hyperlink onPress={(url) => this.handleUrlClick(url) } linkStyle={{color:'#2980b9', fontSize:14}}
                       linkText={(url) =>{return url === 'https://www.getpayper.io/terms' ? 'Payper\'s Terms of Service' : url}}>
             <Text style={[typography.main]}>By creating an account, signing up, or logging into facebook you agree to https://www.getpayper.io/terms. </Text>
            </Hyperlink>
          </View>
        </Animated.View>
      );
    }
  }
}

const LandingScreenView = React.createClass({
  render() {
    return(
      <LandingScreenDisplay  dispatchSetProvider={this.props.dispatchSetProvider} dispatchSetNewUserToken={this.props.dispatchSetNewUserToken}/>
    );
  }
});

export default LandingScreenView;

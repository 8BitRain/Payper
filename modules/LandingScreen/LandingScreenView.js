import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
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
import container from "./styles/container";
import background from "./styles/background";
import typography from "./styles/typography";
import carousel from "./styles/carousel";
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
    var _this = this;
    const infoRequest = new GraphRequest(
      '/me/?fields=email,age_range,first_name,last_name,gender,picture,friends',
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
      //alert('Success fetching data: ' + result.toString());
      console.log(JSON.stringify(result));
      //this.submitFbUser(result);
      this.signInWithFacebook(this.state.fbAcessToken, result);
    }
  }



  /*
  * Sign In With Facebook
  */
  signInWithFacebook(FBToken, result){

    var picture ='';
    console.log(result.picture.data.is_silhouette);
    if(result.picture.data.is_silhouette){
      picture = '';
    } else {
      picture = result.picture.data.url;
    }

    var data = {
      FBToken: FBToken,
      user: {
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        profile_pic: picture,
        gender: result.gender,
        friends: result.friends.data,
        facebook_id: result.id,
        token: ''
      }
    };
    const _this = this;
    //Critical line causing loading issues.
    _this.setState({provider: "facebook"});
    _this.setState({loading: true});
    Init.signInWithFacebook(data, function(signedIn, user) {
        console.log("LandingScreenView - UserPhone: " + user.phone);
        console.log("TOKEN: " + user.token);
        if(!user.phone){
          console.log("userPhone is false");
          _this.props.dispatchSetProvider(_this.state.provider);
          _this.props.dispatchSetToken(user.token);
        }
        _this.setState({fbPhoneNumber: user.phone});
        //_this.setState({provider: user.provider});
        _this.setState({doneLoading: true});
    });
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
            msgLoading={"One sec..."}
            destination={() => Actions.MainViewContainer()} />
        );
      }

      if(this.state.provider == "facebook"){
        console.log("LandingScreen: FACEBOOK ROUTE");
        if(this.state.fbPhone){
          console.log("Value of fbPhone (Existing case): " + this.state.fbPhone);
          return(
            <Loading
              complete={this.state.doneLoading}
              msgSuccess={"Welcome!"}
              msgError={"Sign in failed"}
              msgLoading={"One sec..."}
              destination={() => Actions.MainViewContainer()} />
          );
        }
        //Facebook Account Newly Created
        if(!this.state.fbPhone){
          console.log("Value of fbPhone (Non-Existing case): " + this.state.fbPhone);
          console.log(this.props);
          return(
            <Loading
              complete={this.state.doneLoading}
              msgSuccess={"Welcome!"}
              msgError={"Sign in failed"}
              msgLoading={"One sec..."}
              destination={() => Actions.CreateAccountViewContainer()} />
          );
        }
      }
    } else {
      return (
        <Animated.View style={[container.main, background.main, {opacity: this.animationProps.fadeAnim}]}>

          <View style={[container.third, container.image]}>
            <Text style={[typography.main, typography.fontSizeTitle]}>Coincast</Text>
          </View>

          <View style={[container.quo, container.image]}>
            <ImageCarousel />
          </View>

          <View style={[container.third]}>
            <GenericSignIn destination={Actions.SignInViewContainer}/>
            <GenericSignUp destination={Actions.CreateAccountViewContainer}/>
            {/*TODO Add a Login to Facebook options that covers what is going on with Facebook*/}
            <LoginButton
              readPermissions={["email","public_profile", "user_friends"]}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    alert("login is cancelled.");
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
              onLogoutFinished={() => alert("logout.")}/>
          </View>
        </Animated.View>
      );
    }
  }
}

const LandingScreenView= React.createClass({

  render() {
    console.log("PROPS: " + JSON.stringify(this.props));
    return(
      <LandingScreenDisplay  dispatchSetProvider={this.props.dispatchSetProvider} dispatchSetToken={this.props.dispatchSetToken}/>
    );
  }
});

export default LandingScreenView;

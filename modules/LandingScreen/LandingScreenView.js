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
  * Submit Facebook User information
  */
  // submitFbUser(result){
  //   var picture ='';
  //   console.log(result.picture.data.is_silhouette);
  //   if(result.picture.data.is_silhouette){
  //     picture = '';
  //   } else {
  //     picture = result.picture.data.url;
  //   }
  //
  //   console.log("Facebook account:", result);
  //
  //   var user = {
  //     email: result.email,
  //     first_name: result.first_name,
  //     last_name: result.last_name,
  //     profile_pic: picture,
  //     phone: '3133133113',
  //     provider: 'payper',
  //     gender: result.gender,
  //     friends: result.friends.data,
  //     id: result.id
  //   };
  //   this.state.fbUser = user;
  //   //Note this should send information from Client to FB
  //
  //   console.log("User Data " + JSON.stringify(user));
  //   var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/facebookCreate';
  //   fetch(url, {method: "POST", body: JSON.stringify(user)})
  //   .then((response) => response.json())
  //   .then((responseData) => {
  //     console.log(responseData);
  //     //After adding information to the Server
  //     //Send FB Contact information to FB
  //
  //     console.log(this.state.fbAcessToken);
  //     this.state.fbUser = user;
  //
  //     //this.setState({loading: true});
  //     /*Init.signInWithCredentials(this.state.fbAcessToken, function(signedIn) {
  //       _this.setState({doneLoading: true});
  //     });*/
  //   })
  //   .done();
  // }


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
        phone: '2623058038',
        gender: result.gender,
        friends: result.friends.data,
        facebook_id: result.id,
        token: ''
      }
    };

    // Start loading
    this.setState({loading: true});

    // Push user object to Lambda function
    Init.signInWithFacebook(data, function(signedIn) {
      // Stop loading
      _this.setState({doneLoading: true});
    });

  }


  render() {
    if (this.state.loading) {
      return(
        <Loading
          complete={this.state.doneLoading}
          msgSuccess={"Welcome!"}
          msgError={"Sign in failed"}
          msgLoading={"One sec..."}
          destination={() => Actions.MainViewContainer()} />
      );
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
    return(
      <LandingScreenDisplay  />
    );
  }
});

export default LandingScreenView;

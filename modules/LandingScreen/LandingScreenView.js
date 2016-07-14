import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import FacebookLogin from "../../components/FacebookLogin";
import GenericSignUp from "../../components/GenericSignUp";
import GenericSignIn from "../../components/GenericSignIn";

// Stylesheets
import container from "./styles/container";
import background from "./styles/background";
import typography from "./styles/typography";
import carousel from "./styles/carousel";
var Mixpanel = require('react-native-mixpanel');

// Carousel component for image sliding
import Carousel from 'react-native-carousel';
var dimensions = Dimensions.get('window');

class ImageCarousel1 extends React.Component {
  render() {
    var imgWidth = dimensions.width - 50;
    var imgHeight = 160 / 350;
        imgHeight *= imgWidth;
    return (
      <Carousel hideIndicators={true} animate={true} delay={3500} width={dimensions.width}>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Brady.png')} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Victory.png')} />
        </View>
      </Carousel>
    );
  }
};

class ImageCarousel2 extends React.Component {
  render() {
    var imgWidth = dimensions.width - 50;
    var imgHeight = 160 / 350;
        imgHeight *= imgWidth;
    return (
      <Carousel hideIndicators={true} animate={true} delay={2750} width={dimensions.width}>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/EricSmith.png')} />
        </View>
      </Carousel>
    );
  }
};

class ImageCarousel3 extends React.Component {
  render() {
    var imgWidth = dimensions.width - 50;
    var imgHeight = 160 / 350;
        imgHeight *= imgWidth;
    return (
      <Carousel hideIndicators={true} animate={true} delay={4500} width={dimensions.width}>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Monica.png')} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Moh.png')} />
        </View>
      </Carousel>
    );
  }
};


class LandingScreenDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.animationProps = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };


  }

  componentDidMount() {
    Animations.fadeIn(this.animationProps);
    Mixpanel.sharedInstanceWithToken('507a107870150092ca92fa76ca7c66d6');
    Mixpanel.timeEvent("Landing Screen Duration");
  }

  onFBPress(){

    Mixpanel.track("FBLogin");
    Mixpanel.timeEvent("Completed signup");
    Mixpanel.track("Landing Screen Duration");
    Actions.TrackingContainer();


  }


  onGenericPress(){

    Mixpanel.track("GenericLogin");
    Mixpanel.timeEvent("Completed signup");
    Mixpanel.track("Landing Screen Duration");
    Actions.CreateAccountViewContainer();
  }

  render() {
    var imgWidth = dimensions.width - 50;
    var imgHeight = 160 / 350;
        imgHeight *= imgWidth;
    return (
      <Animated.View style={[container.main, background.main, {opacity: this.animationProps.fadeAnim}]}>

        {/*<View style={[container.third, container.image]}>
          <Text style={[typography.main, typography.fontSizeTitle]}>Coincast</Text>
        </View>*/}

        {/*<View style={[container.third, container.image]}>
          <Image style={{width: imgWidth, height: imgHeight}} source={require('./assets/Brady.png')} />
        </View>*/}
      <View style={{flex: 1, marginTop: 25}}>
        <View style={{flex: .05, alignItems: "center"}}>
          {<Text style={[typography.main, typography.fontSizeSubtleTitle]}>Coincast</Text>}
          {/*<Image style={{width: 64, height: 64}}source={require("./assets/logo.png")/>)*/}
        </View>
        <View style={[container.quo, container.image]}>
          <ImageCarousel1 />
        </View>
        {<View style={[container.quo, container.image]}>
          <ImageCarousel2 />
        </View>}
        <View style={[container.quo, container.image]}>
          <ImageCarousel3 />
        </View>
      </View>

        <View style={[container.third]}>
          { /* <FacebookLogin destination={Actions.SignInWithFacebook}/> */ }
          <GenericSignIn destination={Actions.SignInViewContainer}/>
          <GenericSignUp destination={Actions.CreateAccountViewContainer}/>
        </View>

      </Animated.View>
    );
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

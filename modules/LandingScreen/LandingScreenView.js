import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import FacebookLogin from "../../components/FacebookLogin";
import GenericSignUp from "../../components/GenericSignUp";

// Stylesheets
import container from "./styles/container";
import background from "./styles/background";
import typography from "./styles/typography";
import carousel from "./styles/carousel";

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
    this.animationProps = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };
  }
  componentDidMount() {
    Animations.fadeIn(this.animationProps);
  }
  render() {
    var imgWidth = 250;
    var imgHeight = 165 / 350;
        imgHeight *= imgWidth;
    return (
      <Animated.View style={[container.main, background.main, {opacity: this.animationProps.fadeAnim}]}>

        <View style={[container.third, container.image]}>
          <Text style={[typography.main, typography.fontSizeTitle]}>Coincast</Text>
        </View>

        <View style={[container.quo, container.image]}>
          <ImageCarousel />
        </View>

        <View style={[container.third]}>
          <FacebookLogin destination={Actions.TrackingContainer}/>
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

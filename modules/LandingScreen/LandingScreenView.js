import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import FacebookLogin from "../../components/FacebookLogin";
import GenericSignUp from "../../components/GenericSignUp";

// Houses all non-typography styles for the OnBoarding_CreateAccount module
const styles = StyleSheet.create({
  // Flex positioning
  container: {
    flex: 1
  }
});

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
    return (
      <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
        <FacebookLogin destination={Actions.TrackingContainer}/>
        <GenericSignUp destination={Actions.CreateAccountViewContainer}/>
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

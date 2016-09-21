import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo"
var Mixpanel = require('react-native-mixpanel');

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";
var Mixpanel = require('react-native-mixpanel');

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";

class FirstName extends React.Component {
  constructor(props) {
    super(props);

    // Props for animation
    this.animationProps = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };

    // Props for temporary input storage
    this.firstNameInput = this.props.firstName;

    // Props to be passed to the header
    this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": true,
        "settingsIcon": false,
        "closeIcon": true
      },
      index: 2,
      numCircles: 6
    };

    // Props to be passed to the arrow nav
    this.arrowNavProps = {
      left: true,
      right: true
    };

    // Callback functions to be passed to the header
    this.callbackClose = function() { this.props.callbackClose() };

    // Callback functions to be passed to the arrow nav
    this.onPressRight = function() { this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput) };
    this.onPressLeft = function() { this.props.dispatchSetPage(1, null, null, null) };
  }
  componentDidMount() {
    Animations.fadeIn(this.animationProps);
    Mixpanel.track("Password Page Finished");
    Mixpanel.timeEvent("FirstName page Finished");
  }

  render() {
    return (
      <View style={[containers.container, backgrounds.firstName]}>
        <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

          { /* Prompt and input field */ }
          <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.firstName]}>
            <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>What&#39;s your first name?</Text>
            <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} defaultValue={this.props.firstName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput)}} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstNameValidations(this.firstNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} />
          </View>

          { /* Arrow nav buttons */ }
          <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

          { /* Error messages */ }
          <View style={[containers.sixTenths, backgrounds.firstName]}>
            { this.props.firstNameValidations.capitalized ? null
              : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Not capitalized</Text> }
            { this.props.firstNameValidations.format ? null: <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Invalid character (. and - are allowed)</Text>
               }
            { this.props.firstNameValidations.valid ? <Text style={[typography.validationSuccess, typography.fontSizeError, typography.marginSides]}>Good to go!</Text>
              : null }
          </View>

          { /* Header */ }
          <Header callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />

        </Animated.View>
      </View>
    );
  }
}

export default FirstName;

import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, TouchableHighlight, DeviceEventEmitter} from "react-native";
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
    this.kbOffset = new Animated.Value(0);

    // Props to be passed to the header
    this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": false,
        "settingsIcon": false,
        "closeIcon": false,
        "backIcon": true,
        "appLogo": true
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


        _keyboardWillShow(e) {
          Animated.spring(this.kbOffset, {
            toValue: e.endCoordinates.height,
            friction: 6
          }).start();
        }

        _keyboardWillHide(e) {
          Animated.spring(this.kbOffset, {
            toValue: 0,
            friction: 6
          }).start();
        }

        componentDidMount() {
          _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
          _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
           Animations.fadeIn(this.animationProps);
           Mixpanel.track("Password Page Finished");
           Mixpanel.timeEvent("FirstName page Finished");
        }

        componentWillUnmount() {
          _keyboardWillShowSubscription.remove();
          _keyboardWillHideSubscription.remove();
        }

  render() {
    return (
      <View style={[containers.container, backgrounds.firstName]}>
        <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

          { /* Prompt and input field */ }
          <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.firstName]}>
            <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>What&#39;s your first name?</Text>
            <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {fontWeight: "100"}]} defaultValue={this.props.firstName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput)}} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstNameValidations(this.firstNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} />
          </View>


          { /* Error messages */ }
          <View style={[containers.sixTenths, backgrounds.firstName, {marginTop: 10}]}>
            { this.props.firstNameValidations.capitalized ? null
              : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Not capitalized</Text> }
            { this.props.firstNameValidations.format ? null: <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Invalid character (. and - are allowed)</Text>
               }
            { this.props.firstNameValidations.valid ? <Text style={[typography.validationSuccess, typography.fontSizeError, typography.marginSides]}>Good to go!</Text>
              : null }
          </View>

          { /* Header */ }
        <Header obsidian callbackBack={() => {this.onPressLeft()}} callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />

        </Animated.View>
        <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {this.onPressRight()}}>

            <Animated.View style={{ height: 70, backgroundColor: "#20BF55", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[typography.button, { alignSelf: 'center', textAlign: 'center', color: "#fefeff" }]}>
                 Continue
              </Text>
            </Animated.View>

          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
}

export default FirstName;

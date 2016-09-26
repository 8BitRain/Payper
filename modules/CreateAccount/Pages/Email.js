import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, TouchableHighlight, DeviceEventEmitter} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo";
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

/**
  *   Create account onboarding dumb components
  *   Page 0: Email
  *   Page 1: Password
  *   Page 2: First name
  *   Page 3: Last name
  *   Page 4: Phone number
**/
class Email extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     // Props for temporary input storage
     this.emailInput = this.props.email;
     this.kbOffset = new Animated.Value(0);

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": false,
         "settingsIcon": false,
         "closeIcon": true,
         "appLogo": true,
         "backIcon": false
       },
       index: 0,
       numCircles: 6,
       backgroundColor: "#1E1F20"
     };

     // Callback functions to be passed to the header
     //this.callbackClose = function() { this.props.callbackClose() };



     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: false,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput) };
     this.onPressLeft = function() { this.props.dispatchSetPage(null, null, null, null) };
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
          Mixpanel.timeEvent("Email page Finished");
      }

      componentWillUnmount() {
        _keyboardWillShowSubscription.remove();
        _keyboardWillHideSubscription.remove();
      }
   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

           { /* Prompt and input field */ }
           <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Hey, what&#39;s your email?</Text>
             <TextInput style={[typography.textInput, {fontWeight: "100"}]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput)}} defaultValue={this.props.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmailValidations(this.emailInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="email-address" />
           </View>


           { /* Error messages */ }
           <View style={[containers.sixTenths, backgrounds.email, {marginTop: 10}]}>
              { this.props.emailValidations.format ? null
                : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Not a valid email</Text> }
              { this.props.emailValidations.duplicate ? <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Email already exists</Text>
                : null }
              { this.props.emailValidations.valid ? <Text style={[typography.validationSuccess, typography.fontSizeError, typography.marginSides]}>Good to go!</Text>
                : null }
           </View>

           { /* Header */ }
           <Header obsidian callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />


         </Animated.View>
         { /* Arrow nav buttons */ }
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

export default Email;

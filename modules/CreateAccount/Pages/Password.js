import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo"
var Mixpanel = require('react-native-mixpanel');

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";
var Mixpanel = require('react-native-mixpanel');

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";

class Password extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     // Props for temporary input storage
     this.passwordInput = this.props.password;

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 1,
       numCircles: 6
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: true,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput) };
     this.onPressLeft = function() { this.props.dispatchSetPage(0, null, null, null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
     Mixpanel.track("Email page Finished");
     Mixpanel.timeEvent("Password Page Finished");
   }
   render() {
     return (
       <View style={[containers.container, backgrounds.password]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

           { /* Background */ }
           <View style={[backgrounds.background, backgrounds.password]}></View>

           { /* Prompt and input field */ }
           <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.password]}>
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Enter a secure password</Text>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} defaultValue={this.props.password} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}} onChangeText={(text) => {this.passwordInput = text; this.props.dispatchSetPasswordValidations(this.passwordInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" secureTextEntry={true} placeholder={"not \"password\" :)"} />
           </View>

           { /* Arrow nav buttons */ }
           <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

           { /* Error messages */ }
           <View style={[containers.sixTenths, backgrounds.password]}>
              { this.props.passwordValidations.length ? null
                : function() {
                    if (!this.props.passwordValidations.valid) {
                      console.log("Animate the error message");
                    } else {
                      <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Minimum of 6 chars</Text>
                    }
                  }
              }
              { this.props.passwordValidations.lower ? null
                : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Lowercase</Text> }
              { this.props.passwordValidations.upper ? null
                : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Uppercase</Text> }
              { this.props.passwordValidations.num ? null
                : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Number</Text> }
              { this.props.passwordValidations.sym ? null
                : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Symbol</Text> }
              { this.props.passwordValidations.valid ? <Text style={[typography.validationSuccess, typography.fontSizeError, typography.marginSides]}>Good to go!</Text>
                : null }
           </View>

           { /* Header */ }
           <Header callbackClose={() => {Actions.landingView}} headerProps={this.headerProps} />

         </Animated.View>
       </View>
     );
   }
 }

export default Password;

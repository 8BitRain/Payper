import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";
import validation from "../styles/validation";

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

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 0,
       numCircles: 6
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: false,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput) };
     this.onPressLeft = function() { this.props.dispatchSetPage(null, null, null, null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[containers.container, {opacity: this.animationProps.fadeAnim}]}>
         { /* Background */ }
         <View style={[backgrounds.background, backgrounds.email]}></View>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.contentContainer, containers.email, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Hey, what&#39;s your email?</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput)}} defaultValue={this.props.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmailValidations(this.emailInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholder={"johndoe@example.com"} keyboardType="email-address" />
         </View>

         { /* Arrow nav buttons */ }
         <ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} />

         { /* Error messages */ }
         <View style={[validation.contentContainer, backgrounds.email]}>
            { this.props.emailValidations.format ? null
              : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Not a valid email</Text> }
            { this.props.emailValidations.duplicate ? <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Email already exists</Text>
              : null }
         </View>

         { /* Header */ }
         <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
       </Animated.View>
     );
   }
 }

export default Email;

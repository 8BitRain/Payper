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

class LastName extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props for temporary input storage
   this.lastNameInput = this.props.lastName;

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": true,
       "settingsIcon": false,
       "closeIcon": true
     },
     index: 3,
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
   this.onPressRight = function() { this.props.dispatchSetPage(4, "forward", this.props.lastNameValidations, this.lastNameInput) };
   this.onPressLeft = function() { this.props.dispatchSetPage(2, null, null, null) };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
   Mixpanel.track("FirstName page Finished");
   Mixpanel.timeEvent("LastName page Finished");
   Mixpanel.timeEvent("LastName page Finsihed");
 }
 render() {
   return (
     <View style={[containers.container, backgrounds.lastName]}>
       <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.lastName]}></View>

       { /* Promp and input field */ }
       <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.lastName]}>
         <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>How &#39;bout your last name?</Text>
         <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} defaultValue={this.props.lastName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(4, "forward", this.props.lastNameValidations, this.lastNameInput)}} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastNameValidations(this.lastNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"Doe"} />
       </View>

       { /* Arrow nav buttons */ }
       <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

       { /* Error messages */ }
       <View style={[containers.sixTenths, backgrounds.lastName]}>
         { this.props.lastNameValidations.capitalized ? null
           : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Not capitalized</Text> }
         { this.props.lastNameValidations.format ? null
           : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Invalid character (. and - are allowed)</Text> }
         { this.props.lastName.valid ? <Text style={[typography.validationSuccess, typography.fontSizeError, typography.marginSides]}>Good to go!</Text>
           : null }
       </View>

       { /* Header */ }
       <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
       </Animated.View>
     </View>
   );
 }
}

export default LastName;

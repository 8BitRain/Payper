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
import containers from "../../../styles/containers";
import typography from "../../../styles/typography";

class PhoneNumber extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props for temporary input storage
   this.phoneNumberInput = this.props.phoneNumber;

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": true,
       "settingsIcon": false,
       "closeIcon": true
     },
     index: 4,
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
   this.onPressRight = function() { this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput) };
   this.onPressLeft = function() { this.props.dispatchSetPage(3, null, null, null) };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[containers.container, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.phoneNumber]}></View>

       { /* Prompt and input field */ }
       <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.phoneNumber]}>
         <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Can I have your number?</Text>
         <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput)}} defaultValue={this.props.phoneNumber} onChangeText={(text) => {this.phoneNumberInput = text}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"262-305-8038"} maxLength={10} keyboardType="phone-pad" />
       </View>

       { /* Arrow nav buttons */ }
       <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

       { /* Filler */ }
       <View style={[containers.sixTenths, backgrounds.email]}></View>
       { /* Header */ }
       <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
    </Animated.View>
   );
 }
}

export default PhoneNumber;

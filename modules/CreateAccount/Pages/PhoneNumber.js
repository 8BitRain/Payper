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
var Mixpanel = require('react-native-mixpanel');

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";

//Icons
import Entypo from "react-native-vector-icons/Entypo"

//Init
import * as Init from '../../../_init';

class PhoneNumber extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props for temporary input storage
   this.phoneNumberInput = this.props.phone;

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

   if(this.props.provider == "facebook"){
     this.arrowNavProps = {
       left: false,
       right: false,
       check: true
     };
   }



   // Callback functions to be passed to the arrow nav
   this.onPressRight = function() { this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput) };
   this.onPressLeft = function() { this.props.dispatchSetPage(3, null, null, null) };
   this.onPressCheck = function() {
     //this.props.phone = this.phoneNumberInput;
     console.log(this.phoneNumberInput);
     this.props.dispatchSetPhone(this.phoneNumberInput);
     //this.props.dispatchSetNewUserToken(this.props.newUser.token);
     console.log(this.props.newUser.phone);
     console.log("Token: " + this.props.newUser.token);
     var data = {
       token: this.props.newUser.token,
       phone: this.props.newUser.phone
     };
     console.log("Data: " + JSON.stringify(data));
     this.updatePhone(data);
   }
 }

  updatePhone(data){
    Init.updatePhone(data, function(updatedPhone){
      if(updatedPhone){
        //Actions.MainViewContainer();
        Actions.BankOnboardingContainer();
      }
    });
  }

 componentDidMount() {
   Animations.fadeIn(this.animationProps);
   Mixpanel.track("LastName page Finsihed");
   Mixpanel.timeEvent("Phone# page Finished");
 }
 render() {
   return (
     <Animated.View style={[containers.container, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.phoneNumber]}></View>

       { /* Prompt and input field */ }
       <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.phoneNumber]}>
         <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Can I have your number?</Text>
         <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput)}} defaultValue={this.props.phone} onChangeText={(text) => {this.phoneNumberInput = text}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"262-305-8038"} maxLength={10} keyboardType="phone-pad" />
       </View>

       { /* Arrow nav buttons */ }
       { this.props.provider == "facebook" ? <ArrowNav arrowNavProps={this.arrowNavProps} callbackCheck={() => {this.onPressCheck()}} />
         : <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />}

       { /* Filler */ }
       <View style={[containers.sixTenths, backgrounds.email]}></View>
       { /* Header */ }
       <Header callbackClose={() => {Actions.landingView}} headerProps={this.headerProps} />
    </Animated.View>
   );
 }
}

export default PhoneNumber;

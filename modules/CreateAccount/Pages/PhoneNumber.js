import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, TouchableHighlight, DeviceEventEmitter} from "react-native";
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

   this.kbOffset = new Animated.Value(0);
   // Props for temporary input storage
   this.phoneNumberInput = this.props.phone;

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": false,
       "settingsIcon": false,
       "closeIcon": false,
       "appLogo": true,
       "backIcon": true
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
    Mixpanel.track("LastName page Finsihed");
    Mixpanel.timeEvent("Phone# page Finished");
 }

 componentWillUnmount() {
   _keyboardWillShowSubscription.remove();
   _keyboardWillHideSubscription.remove();
 }
 render() {
   console.log("Phone number validations:", this.props.phoneValidations);
   return (
    <View style={[backgrounds.background, backgrounds.phoneNumber]}>
     <Animated.View style={[containers.container, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.phoneNumber]}></View>

       { /* Prompt and input field */ }
       <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.phoneNumber]}>
         <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>{ "What's your phone number?" }</Text>
         <TextInput
          style={[typography.textInput, typography.marginSides, typography.marginBottom, {fontWeight: "100"}]}
          onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput)}}
          defaultValue={this.props.phone}
          onChangeText={(text) => {this.phoneNumberInput = text; this.props.dispatchSetPhoneValidations(Validators.validatePhone(this.phoneNumberInput))}}
          autoCorrect={false} autoFocus={true}
          maxLength={10}
          keyboardType="phone-pad" />
       </View>

       { /* Error messages */ }
       <View style={[containers.sixTenths, backgrounds.phoneNumber, {marginTop: 10}]}>
         { this.props.phoneValidations.valid ? <Text style={[typography.validationSuccess, typography.fontSizeError, typography.marginSides]}>Good to go!</Text>
           : null }
       </View>

       { /* Header */ }
       <Header obsidian callbackBack={() => {this.onPressLeft()}} callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />

    </Animated.View>
    <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => {  this.props.provider == "facebook" ? this.onPressCheck() : this.onPressRight()}}>

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

export default PhoneNumber;

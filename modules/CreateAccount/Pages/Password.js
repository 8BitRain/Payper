import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, TouchableHighlight, DeviceEventEmitter} from "react-native";
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
     this.kbOffset = new Animated.Value(0);

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": false,
         "settingsIcon": false,
         "closeIcon": false,
         "appLogo" : true,
         "backIcon" : true

       },
       index: 1,
       obsidian: true,
       numCircles: 6
     };

     // Callback functions to be passed to the header
     //this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: true,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput) };
     this.onPressLeft = function() { this.props.dispatchSetPage(0, null, null, null) };
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
      Mixpanel.track("Email page Finished");
      Mixpanel.timeEvent("Password Page Finished");
   }

   componentWillUnmount() {
     _keyboardWillShowSubscription.remove();
     _keyboardWillHideSubscription.remove();
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
             <TextInput style={[typography.textInput, {fontWeight: "100"}]} defaultValue={this.props.password} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}} onChangeText={(text) => {this.passwordInput = text; this.props.dispatchSetPasswordValidations(this.passwordInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" secureTextEntry={true} placeholder={""} />
           </View>



           { /* Error messages */ }
           <View style={[containers.sixTenths, backgrounds.password, {marginTop: 10}]}>
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
           <Header callbackBack={() => {this.onPressLeft()}} callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />

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

export default Password;

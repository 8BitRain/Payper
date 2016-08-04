import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
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


class Address extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };


     /*if(this.firebase_token == ''){
       Async.get('session_token', (token) => {
         this.token = token;
         //dispatchSetFirebaseToken
         console.log("Token: " + token);
         this.props.dispatchSetFirebaseToken(this.token);
       });
     }*/

     // Props for temporary input storage
     //Address, City, State, Zio
     this.addressInput = "";
     this.cityInput ="";
     this.stateInput = "";
     this.zipInput = "";



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
     this.onPressRight = function() { this.props.dispatchSetPage(2, "forward") };
     this.onPressLeft = function() { this.props.dispatchSetPage(null, null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
     //Mixpanel.timeEvent("Email page Finished");
   }
   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Email</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.addressInput = text; this.props.dispatchSetAddress(this.addressInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>First Name</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.cityInput = text; this.props.dispatchSetCity(this.cityInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Last Name</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.stateInput = text; this.props.dispatchSetState(this.stateInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Phone</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.zipInput = text; this.props.dispatchSetZip(this.zipInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />
         </View>

           { /* Arrow nav buttons */ }
           <ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} />


           { /* Header */ }
           <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

         </Animated.View>
       </View>
     );
   }
 }

export default Address;

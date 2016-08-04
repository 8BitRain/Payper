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


class BasicInfo extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     //For setting up initial Firebase. (Think about calling this in the actual view)
     /*if(this.firebase_token == ''){
       Async.get('session_token', (token) => {
         this.token = token;
         //dispatchSetFirebaseToken
         console.log("Token: " + token);
         this.props.dispatchSetFirebaseToken(this.token);
       });
     }*/

     // Props for temporary input storage
     this.emailInput = this.props.currentUser.email;
     this.firstNameInput = this.props.currentUser.firstName;
     this.lastNameInput = this.props.currentUser.lastName;
     this.phoneInput = this.props.currentUser.phone;

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 0,
       numCircles: 4
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: false,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(1, "forward") };
     this.onPressLeft = function() { this.props.dispatchSetPage(null, null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
     //Mixpanel.timeEvent("Email page Finished");
   }
   render() {
     return (

       <View style={[containers.container, backgrounds.email]}>
          {/*TODO Update View style*/}
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

           { /* Prompt and input field */ }
           <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Email</Text>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.currentUser.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmail(this.emailInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>First Name</Text>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.currentUser.firstName} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstName(this.firstNameInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"Jane"} keyboardType="email-address" />
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Last Name</Text>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.currentUser.lastName} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastName(this.lastNameInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"Victory"} keyboardType="email-address" />
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Phone</Text>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.currentUser.phone} onChangeText={(text) => {this.phoneInput = text; this.props.dispatchSetPhone(this.phoneInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"123-456-7890"} keyboardType="phone-pad" />
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

export default BasicInfo;

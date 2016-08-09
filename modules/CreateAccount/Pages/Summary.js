import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";
import * as Init from "../../../_init";

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";
var Mixpanel = require('react-native-mixpanel');

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";

class Summary extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": true,
       "settingsIcon": false,
       "closeIcon": true
     },
     index: 5,
     numCircles: 6
   };

   // Callback functions to be passed to the header
   this.callbackClose = function() { this.props.callbackClose() };

   // Props to be passed to the arrow nav
   this.arrowNavProps = {
     left: true,
     right: false,
     check: true
   };

   // Callback functions to be passed to the arrow nav
   this.onPressLeft = function() { this.props.dispatchSetPage(4, null, null, null) };
   this.onPressCheck = function() {
     var _this = this;
     Init.createUser(this.props.currentUser, function(userCreated, token){
       if(userCreated){
         console.log("USER TOKEN: " + token);
         _this.props.dispatchSetToken(token);
         console.log(_this.props.currentUser.token);
         Actions.BankOnboardingContainer();
       }
     });
   };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
   Mixpanel.track("Phone# page Finished");

 }
 render() {
   return (
     <Animated.View style={[containers.container, containers.summary, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.summary]}></View>

       { /* Prompt and submit button */ }
       <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.summary]}>
         <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Does this look right?</Text>

         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.currentUser.email}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.currentUser.password}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.currentUser.firstName}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.currentUser.lastName}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.currentUser.phone}</Text>
       </View>

       { /* Arrow nav buttons */ }
       <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackCheck={() => {this.onPressCheck()}} />

       { /* Header */ }
       <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
     </Animated.View>
   );
 }
}

export default Summary;

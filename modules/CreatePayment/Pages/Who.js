import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";

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

/**
  *   'To' and 'From' onboarding for payment creation
**/
class Who extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": true,
         "circleIcons": false,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 0,
       numCircles: null
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <View style={[containers.container]}>

         { /* Header */ }
         <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
       </View>
     );
   }
 }

export default Who;

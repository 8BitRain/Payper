import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, DeviceEventEmitter, Image, TouchableHighlight} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo";
var Mixpanel = require('react-native-mixpanel');

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";
import * as Async from '../../../helpers/Async';
import * as Firebase from '../../../services/Firebase';


var Mixpanel = require('react-native-mixpanel');

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";
import EvilIcons from "react-native-vector-icons/EvilIcons";

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";

//Init
import * as Init from '../../../_init';

class Comfort extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.kbOffset = new Animated.Value(0);


     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };


     this.uid = "";

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": false,
         "settingsIcon": false,
         "closeIcon": false,
         "backIcon" : false,
         "appLogo" : true
       },
       index: 3,
       numCircles: 4
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
     this.onPressRight = function() { this.props.dispatchSetPageX(1, "forward", true) };
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
   }

   componentWillUnmount() {
     _keyboardWillShowSubscription.remove();
     _keyboardWillHideSubscription.remove();
   }


   componentWillMount() {
     // Initialize the app
   }



   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Verify your identity.</Text>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {marginTop: 100, textAlign: "center"}]}>To ensure you aren’t being impersonated we need you to verify your identity. We would like your legal name, billing address, date of birth, and social security number.</Text>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {marginTop: 145, textAlign: "center"}]}>*Don’t worry! Your information is securely encrypted  and not stored in our database.</Text>
         </View>

           { /* Arrow nav buttons */ }
           {/*<ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackCheck={() => {this.onPressCheck()}} />*/}

           { /* Header */ }
           <Header callbackBack={() => {this.onPressLeft()}} callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

         </Animated.View>
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

export default Comfort;

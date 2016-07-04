import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";

// Stylesheets
import containers from "../../../styles/containers";
import typography from "../../../styles/typography";
import backgrounds from "../../../styles/backgrounds";

/**
  *   Email onboarding base component
**/
class Password extends React.Component {
   constructor(props) {
     super(props);

     // Props for temporary input storage
     this.input = this.props.password;

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 1,
       numCircles: 6
     };

     // Callback functions to be passed to the header
     this.closeModal = function() { Actions.LandingPage };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: true,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.nextPage = function() {
       if (this.props.passwordValidations.valid) {
         alert("go to the next page");
       } else {
         alert("invalid password");
       }
     };
     this.lastPage = function() {
       Actions.pop();
     };
   }
   render() {
     return (
       <View style={[containers.container, backgrounds.password]}>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.password]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Enter a secure password</Text>
           <TextInput
             style={[typography.textInput, typography.marginSides, typography.marginBottom]}
             placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" secureTextEntry={true} placeholder={"not \"password\" :)"}
             autoCorrect={false} autoFocus={true} autoCapitalize="none"
             onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this.nextPage() }}
             onChangeText={(text) => {this.input = text; this.props.validate("password", this.input)}}
             defaultValue={this.props.password}
           />
         </View>

         { /* Arrow nav buttons */ }
         <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.lastPage()}} callbackRight={() => {this.nextPage()}} />

         { /* Error messages */ }
         <View style={[containers.sixTenths, backgrounds.password]}>
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
         </View>

         { /* Header */ }
         <Header callbackClose={() => {this.closeModal()}} headerProps={this.headerProps} />
       </View>
     );
   }
 }

export default Password;

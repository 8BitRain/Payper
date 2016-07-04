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
class Email extends React.Component {
   constructor(props) {
     super(props);

     // Props from CreateAccountContainer connect function
     console.log(JSON.stringify(props));
     // TESTING

     // Props for temporary input storage
     this.input = this.props.email;

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
     this.closeModal = function() { Actions.LandingPage };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: false,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.nextPage = function() {
       console.log(this.props.validations);
       if (true) {
         Actions.Password();
       } else {
         alert('invalid');
       }
     };
     this.lastPage = function() {};
   }
   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Hey, what&#39;s your email?</Text>
           <TextInput
              style={[typography.textInput, typography.marginSides, typography.marginBottom]}
              placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"}
              keyboardType="email-address"
              autoCorrect={false} autoFocus={true} autoCapitalize="none"
              onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this.nextPage() }}
              onChangeText={(text) => {this.input = text; this.props.validate("email", this.input)}}
              defaultValue={this.props.email}
            />
         </View>

         { /* Arrow nav buttons */ }
         <ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.nextPage()}} />

         { /* Error messages */ }
         <View style={[containers.sixTenths, backgrounds.email]}>
            { this.props.emailValidations.format
              ? null
              : <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Not a valid email</Text> }
            { this.props.emailValidations.duplicate
              ? <Text style={[typography.general, typography.fontSizeError, typography.marginSides]}>Email already exists</Text>
              : null }
         </View>

         { /* Header */ }
         <Header callbackClose={() => {this.closeModal()}} headerProps={this.headerProps} />
       </View>
     );
   }
 }

export default Email;

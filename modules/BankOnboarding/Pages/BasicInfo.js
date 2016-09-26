import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, DeviceEventEmitter, TouchableHighlight} from "react-native";
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

import EvilIcons from "react-native-vector-icons/EvilIcons";


class BasicInfo extends React.Component {
   constructor(props) {
     super(props);

     this.kbOffset = new Animated.Value(0);
     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     this.state = {
       validInput: false
     };


     // Set initial values from create user process.
     if(this.props.newUser.email && this.props.newUser.firstName
       && this.props.newUser.lastName && this.props.newUser.phone){
         console.log("BasicInfo: Setting email, firstname, lastname, and phone");
         this.emailInput = this.props.newUser.email;
         this.firstNameInput = this.props.newUser.firstName;
         this.lastNameInput = this.props.newUser.lastName;
         this.phoneInput = this.props.newUser.phone;

         //We can assume that the following validations are correct. If a user
         //changes an input field, the new input will be validated by TextInput
         this.props.dispatchSetCEmailValidations(this.emailInput);
         this.props.dispatchSetCFirstNameValidations(this.firstNameInput);
         this.props.dispatchSetCLastNameValidations(this.lastNameInput);
         this.props.dispatchSetCPhoneValidations(this.phoneInput);


     } else {
       console.log("Can't set up email, firstname, lastName, and phone")
       this.emailInput = this.props.dwollaCustomer.email;
       this.firstNameInput = this.props.dwollaCustomer.firstName;
       this.lastNameInput = this.props.dwollaCustomer.lastName;
       this.phoneInput = this.props.dwollaCustomer.phone;
     }


     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": false,
         "settingsIcon": false,
         "closeIcon": false,
         "backIcon": true,
         "appLogo": true
       },
       index: 0,
       numCircles: 4,
     };

     // Callback functions to be passed to the header
     //this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: false,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() {
       this.props.dispatchSetEmail(this.emailInput);
       this.props.dispatchSetFirstName(this.firstNameInput);
       this.props.dispatchSetLastName(this.lastNameInput);
       this.props.dispatchSetPhone(this.phoneInput);

       if(!this.props.cemailValidations.valid || !this.props.cfirstNameValidations.valid ||
       !this.props.clastNameValidations.valid || !this.props.cphoneValidations.valid){
         console.log("Error with validations");
         /*TODO Loop through validation errors to then animate (move up and down)
           input fields that the user needs to correct. This can maybe flag a hint as
           well?*/

       } else {
         this.props.dispatchSetPageX(2, "forward", true);
       }
     };
         this.onPressLeft = function() { this.props.dispatchSetPageX(0, "backward", null) };
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
   render() {
     return (

       <View style={[containers.container, backgrounds.email]}>
          {/*TODO Update View style*/}
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

           { /* Prompt and input field */ }
           <View  style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           { /*Email*/}

            <View>
              <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {marginLeft: 20, fontWeight: "100"}]}  defaultValue={this.props.newUser.email ? this.props.newUser.email: this.props.dwollaCustomer.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmail(this.emailInput); this.props.dispatchSetCEmailValidations(this.emailInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" placeholder={"Email"} keyboardType="email-address" />
              {this.props.cemailValidations.valid ? <EvilIcons  style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'grey'} />}
            </View>

             { /*FirstName*/}

            {/*FirstName TextInput*/}
            <View>
              <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom,{marginLeft: 20, fontWeight: "100"}]}  defaultValue={this.props.newUser.firstName ? this.props.newUser.firstName : this.props.dwollaCustomer.firstName} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstName(this.firstNameInput); this.props.dispatchSetCFirstNameValidations(this.firstNameInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" placeholder={"Legal First Name"} keyboardType="default" />
              {this.props.cfirstNameValidations.valid ? <EvilIcons  style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'grey'} />}
            </View>

             { /*LastName*/}

             <View>
               <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom,{marginLeft: 20, fontWeight: "100"}]}  defaultValue={this.props.newUser.lastName ? this.props.newUser.lastName : this.props.dwollaCustomer.lastName} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastName(this.lastNameInput); this.props.dispatchSetCLastNameValidations(this.lastNameInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" placeholder={"Legal Last Name"} keyboardType="default" />
               {this.props.clastNameValidations.valid ? <EvilIcons  style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'grey'} />}
             </View>

              { /*PhoneNumber*/}

             <View>
               <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom,{marginLeft: 20, fontWeight: "100"}]}  defaultValue={this.props.newUser.phone ? this.props.newUser.phone : this.props.dwollaCustomer.phone} onChangeText={(text) => {this.phoneInput = text; this.props.dispatchSetPhone(this.phoneInput); this.props.dispatchSetCPhoneValidations(this.phoneInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" maxLength={10} placeholder={"Phone Number"} keyboardType="phone-pad" />
               {this.props.cphoneValidations.valid ? <EvilIcons  style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'grey'} />}
             </View>

           </View>

           { /* Arrow nav buttons */ }
           {/*<ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} />*/}

           { /* Header */ }
           <Header obsidian callbackBack={() => {this.onPressLeft()}} headerProps={this.headerProps} />

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

export default BasicInfo;

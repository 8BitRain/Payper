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

import EvilIcons from "react-native-vector-icons/EvilIcons";


class BasicInfo extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     this.state = {
       validInput: false
     };


     // Should this be moved to onmount or onload? Props for temporary input storage.
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
     }


     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 0,
       numCircles: 4,
       title: "Basic Information"
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

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
         this.props.dispatchSetPageX(1, "forward", true);
       }
     };
     this.onPressLeft = function() { this.props.dispatchSetPageX(null, null, null) };
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
           <View  style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           { /*Email*/}
            <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
             {this.props.cemailValidations.valid ? <EvilIcons  style={{ position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>Email</Text>
            </View>
            <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {marginLeft: 65}]}  defaultValue={this.props.newUser.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmail(this.emailInput); this.props.dispatchSetCEmailValidations(this.emailInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"TEST"} keyboardType="email-address" />
          { /*Email TextInput*/}
            {/*<TextInput style={[typography.textInput, typography.marginSides, {marginLeft: 65}]}  defaultValue={this.props.newUser.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmail(this.emailInput); this.props.dispatchSetCEmailValidations(this.emailInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="email-address" />}
          {/*TextInput Underline*/}
          {/*<View style={{borderBottomWidth: 2, borderBottomColor: "#F4F4F9", marginLeft: 65, width: 250  , marginBottom: 10, position: "absolute", bottom: 230 }}>
          </View>*/}



             { /*FirstName*/}
            <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
              {this.props.cfirstNameValidations.valid ? <EvilIcons  style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
              <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>First Name</Text>
            </View>
            {/*FirstName TextInput*/}
            <TextInput style={[typography.textInput, typography.marginSides, {marginLeft: 65}]}  defaultValue={this.props.newUser.firstName} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstName(this.firstNameInput); this.props.dispatchSetCFirstNameValidations(this.firstNameInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="default" />
            {/*TextInput Underline*/}
        

             { /*LastName*/}
             <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
              {this.props.clastNameValidations.valid ? <EvilIcons  style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
              <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>Last Name</Text>
             </View>
             <TextInput style={[typography.textInput, typography.marginSides, {marginLeft: 65}]}  defaultValue={this.props.newUser.lastName} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastName(this.lastNameInput); this.props.dispatchSetCLastNameValidations(this.lastNameInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="default" />


              { /*PhoneNumber*/}
             <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>

               {/*this.props.phoneValidations.valid ? <EvilIcons  style={{position: "absolute", left: 250, top: 15}} name="check" size={60} color={'green'} /> : <EvilIcons style={{position: "absolute", left: 250, top: 25}} name="check" size={30} color={'grey'} />*/}
               {this.props.cphoneValidations.valid ? <EvilIcons  style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
               <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>Phone</Text>
             </View>
             <TextInput style={[typography.textInput, typography.marginSides, {marginLeft: 65}]}  defaultValue={this.props.newUser.phone} onChangeText={(text) => {this.phoneInput = text; this.props.dispatchSetPhone(this.phoneInput); this.props.dispatchSetCPhoneValidations(this.phoneInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="phone-pad" />


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

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

import EvilIcons from "react-native-vector-icons/EvilIcons"


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
     this.emailInput = this.props.newUser.email;
     this.firstNameInput = this.props.newUser.firstName;
     this.lastNameInput = this.props.newUser.lastName;
     this.phoneInput = this.props.newUser.phone;

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
     this.onPressRight = function() {
       this.props.dispatchSetEmail(this.emailInput);
       this.props.dispatchSetFirstName(this.firstNameInput);
       this.props.dispatchSetLastName(this.lastNameInput);
       this.props.dispatchSetPhone(this.phoneInput);
        this.props.dispatchSetPageX(1, "forward", true);
       //this.props.dispatchSetBasicInfo(, this.firstNameInput, )
       //Check to see if basicInfo is valid, if not don't continue and prompt animationProps
       /*this.props.dispatchSetBasicInfo(this.props.firstNameValidations, this.props.lastNameValidations,
        this.props.emailValidations, this.props.phoneValidations);*/
      //console.log(this.props.basicInfoValidations);
       /*if(this.props.basicInfoValidations.valid){
         this.props.dispatchSetPageX(1, "forward", true);
       } else{
         console.log("Error with validations");
       }*/

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
           <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           { /*Email*/}
            <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
              { /* Icon appears on left side of Text label when Text label has marginLeft set to 20<EvilIcons  style={{ marginLeft: 5}} name="check" size={40} color={'green'} />*/}
              {/*<Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 20}]}>Email</Text>*/}
             {this.props.emailValidations.valid ? <EvilIcons  style={{ position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>Email</Text>
             {/*this.props.phoneValidations.valid ? <EvilIcons  style={{position: "absolute", left: 250, top: 15}} name="check" size={60} color={'green'} /> : <EvilIcons style={{position: "absolute", left: 250, top: 25}} name="check" size={30} color={'grey'} />*/}

            </View>
            <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {marginLeft: 65}]}  defaultValue={this.props.newUser.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmail(this.emailInput); this.props.dispatchSetEmailValidations(this.emailInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />

             { /*FirstName*/}
            <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
              {/*this.props.phoneValidations.valid ? <EvilIcons  style={{position: "absolute", left: 250, top: 15}} name="check" size={60} color={'green'} /> : <EvilIcons style={{position: "absolute", left: 250, top: 25}} name="check" size={30} color={'grey'} />*/}
              {true ? <EvilIcons  style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
              <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>First Name</Text>
            </View>
            <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {marginLeft: 65}]}  defaultValue={this.props.newUser.firstName} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstName(this.firstNameInput); this.props.dispatchSetCFirstNameValidations(this.firstNameInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"Jane"} keyboardType="email-address" />

             { /*LastName*/}
             <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>

              {/*this.props.phoneValidations.valid ? <EvilIcons  style={{position: "absolute", left: 250, top: 15}} name="check" size={60} color={'green'} /> : <EvilIcons style={{position: "absolute", left: 250, top: 25}} name="check" size={30} color={'grey'} />*/}

              {true  ? <EvilIcons  style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
              <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>Last Name</Text>
             </View>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {marginLeft: 65}]}  defaultValue={this.props.newUser.lastName} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastName(this.lastNameInput); this.props.dispatchSetCLastNameValidations(this.lastNameInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"Victory"} keyboardType="email-address" />

              { /*PhoneNumber*/}
             <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>

               {/*this.props.phoneValidations.valid ? <EvilIcons  style={{position: "absolute", left: 250, top: 15}} name="check" size={60} color={'green'} /> : <EvilIcons style={{position: "absolute", left: 250, top: 25}} name="check" size={30} color={'grey'} />*/}
               {this.props.phoneValidations.valid ? <EvilIcons  style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", bottom: .5, left: 5}} name="check" size={40} color={'grey'} />}
               <Text style={[typography.general, typography.fontSizeTitle, typography.marginBottom, {marginLeft: 65}]}>Phone</Text>
             </View>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom, {marginLeft: 65}]}  defaultValue={this.props.newUser.phone} onChangeText={(text) => {this.phoneInput = text; this.props.dispatchSetPhone(this.phoneInput); this.props.dispatchSetPhoneValidations(this.phoneInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"123-456-7890"} keyboardType="phone-pad" />

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

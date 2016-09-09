import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, DeviceEventEmitter, Image} from "react-native";
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

class SSN extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.kbOffset = new Animated.Value(0);

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
     this.SSNInput = this.props.dwollaCustomer.ssn;
     this.uid = "";

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": false
       },
       index: 3,
       title: "Customer Verfication",
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
     this.onPressLeft = function() { this.props.dispatchSetPageX(2, "backward", null) };
     this.onPressCheck = function(){
       var data = {
         "firstName": this.props.dwollaCustomer.firstName,
         "lastName": this.props.dwollaCustomer.lastName,
         "email": this.props.dwollaCustomer.email,
         "phone": this.props.dwollaCustomer.phone,
         "address": this.props.dwollaCustomer.address,
         "city": this.props.dwollaCustomer.city,
         "state": this.props.dwollaCustomer.state,
         "zip": this.props.dwollaCustomer.zip,
         "dob": this.props.dwollaCustomer.dob,
         "ssn": this.props.dwollaCustomer.ssn,
         "token": this.props.newUser.token
       }
       this.createCustomer(data);

     }
   }

   _keyboardWillShow(e) {
     Animated.spring(this.kbOffset, {
       toValue: e.endCoordinates.height - 40,
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
      this.props.stopListening(this.props.activeFirebaseListeners);
   }

   createCustomer(data){
     //data.token = {this.props.firebase_token};
     console.log("FirebaseToken: " + this.props.newUser.token);
     //console.log("DataToken: " + data.token);
     var _this = this;
     Init.createCustomer(data, function(customerCreated){
       console.log("CustomerCreated?: " + customerCreated);
       //Grab UId
       Async.get('user', (val) => {
           console.log("User: " + val);
           console.log("User: " + JSON.parse(val).uid);
         var iav = "IAV/" + JSON.parse(val).uid;
         //Enable FirebaseListeners
         _this.props.listen([iav]);
         //dispatch will be called from container
       });
      // _this.initiateIAV(_this.props.newUser.token, _this);
     });
   }

   initiateIAV(token, _this){
      var data = {
        token: token
      };
      //var _this = this;
      console.log("Beginning IAV Initiation");
      Init.getIavToken(data, function(iavTokenRecieved, iavToken){
        if(iavTokenRecieved){
          console.log("SSN IAVTOKEN: " + JSON.stringify(iavToken));
          //Will cause the IAV Token Page to be loaded
          _this.props.dispatchSetIav(iavToken.token);
        }
      });
   }

   componentWillMount() {
     // Initialize the app
   }



   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>SSN</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.dwollaCustomer.ssn} onChangeText={(text) => {this.SSNInput = text; this.props.dispatchSetSSN(this.SSNInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="default" />
         </View>

           { /* Arrow nav buttons */ }
           {/*<ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackCheck={() => {this.onPressCheck()}} />*/}

           { /* Header */ }
           <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

         </Animated.View>
         <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
           <ArrowNav
             arrowNavProps={this.arrowNavProps}
             callbackCheck={() => {this.onPressCheck()}}
             callbackLeft={() => {this.onPressLeft()}} />
         </Animated.View>
       </View>
     );
   }
 }

export default SSN;

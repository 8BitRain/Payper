import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/Header/Header.js';



//styles
import backgrounds from "./styles/backgrounds";
import containers from "./styles/containers";
import typography from "./styles/typography";
import colors from '../../styles/colors';



var Mixpanel = require('react-native-mixpanel');



class OnBoardingSummaryTest extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };
     this.firstName ='';
     this.lastName;
     this.email;
     this.ipadress;
     this.type;
     this.address1;
     this.address2;
     this.city;
     this.state;
     this.postalCode;
     this.dob;
     this.ssn;
     this.phone;
   //Header props
   this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": false,
        "settingsIcon": true,
        "closeIcon": false
      },
      index: 0,
      numCircles: 6
    };

    /*this.submitUserCredentials = function(){
      console.log("Submitting user credentials");
      console.log(this.firstName);
      console.log(this.lastName);
      console.log(this.email);
      console.log(this.ipaddress);
      console.log(this.type);
      console.log(this.address1);
      console.log(this.address2);
      console.log(this.city);
      console.log(this.postalCode);
      console.log(this.dob);
      console.log(this.ssn);
      console.log(this.phone);
    };*/

}
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }

   submitUserCredentials(){
     console.log("Submitting user credentials");
     console.log(this.firstName);
     console.log(this.lastName);
     console.log(this.email);
     console.log(this.address1);
     console.log(this.city);
     console.log(this.state);
     console.log(this.postalCode);
     console.log(this.dob);
     console.log(this.ssn);
     console.log(this.phone);

     var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/create';
     var data = {
       firstName: this.firstName,
       lastName: this.lastName,
       email: this.email,
       address: this.address1,
       city: this.city,
       state: this.state,
       zip: this.postalCode,
       dob: this.dob,
       ssn: this.ssn,
       phone: this.phone
     };

     console.log(data);

     fetch(url, {method: "POST", body: JSON.stringify(data)})
     .then((response) => response.json())
     .then((responseData) => {
       //AsyncStorage.setItem("@Store:session_key", token);
       console.log(responseData);
     })
     .done();
   }

   onThankYouPress() {
     Actions.ThankYouView();
   }

   dwollaTestData(){
     console.log("Dwolla Test Data");

   }

   onBridgeMessage(message){
   const { webviewbridge } = this.refs;

   switch (message) {
     case "hello from webview":
       webviewbridge.sendToBridge("hello from react-native");
       break;
     case "got the message inside webview":
       console.log("we have got a message from webview! yeah");
       break;
   }
 }


   render() {
     return (
       <Animated.View style={[containers.contentContainer, {opacity: this.animationProps.fadeAnim, backgroundColor: colors.darkGrey}]}>
       <View style={{alignItems:"center"}}>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.firstName = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"First"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.lastName = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Last"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.email = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"email"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.address1 = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"address"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.city = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"city"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.state = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"state"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.postalCode= text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"zip"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.dob = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"dob"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.ssn = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"ssn"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.phone = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"phone"}/>

         <Text> User routing information</Text>
         <Button onPress={() => this.submitUserCredentials()}><Text style={typography.general}>Create Verified Customer</Text></Button>

         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.routing = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Routing #"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.account = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Account #"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.type = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Type (checking or savings)"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.name = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Name"}/>

       </View>

       </Animated.View>
     );
   }
 }


const BankOnboardingView = React.createClass({
  render() {
    return(
      <OnBoardingSummaryTest  />
    );
  }
});

export default BankOnboardingView;

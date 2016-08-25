import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Picker} from "react-native";
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


class Address extends React.Component {
   constructor(props) {
     super(props);


     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     this.state_list = {
       ALABAMA:	'AL',
       ALASKA:	'AK',
       ARIZONA:	'AZ',
       ARKANSAS:	'AR',
       CALIFORNIA:	'CA',
       COLORADO:	'CO',
       CONNECTICUT:	'CT',
       DELAWARE:	'DE',
       FLORIDA:	'FL',
       GEORGIA:	'GA',
       HAWAII:	'HI',
       IDAHO:	'ID',
       ILLINOIS:	'IL',
       INDIANA:	'IN',
       IOWA:	'IA',
       KANSAS:	'KS',
       KENTUCKY:	'KY',
       LOUISIANA:	'LA',
       MAINE:	'ME',
       MARYLAND:	'MD',
       MASSACHUSETTS:	'MA',
       MICHIGAN:	'MI',
       MINNESOTA:	'MN',
       MISSISSIPPI:	'MS',
       MISSOURI:	'MO',
       MONTANA:	'MT',
       NEBRASKA:	'NE',
       NEVADA:	'NV',
       NEW_HAMPSHIRE:	'NH',
       NEW_JERSEY:	'NJ',
       NEW_MEXICO:	'NM',
       NEW_YORK:	'NY',
       NORTH_CAROLINA:	'NC',
       NORTH_DAKOTA:	'ND',
       OHIO: 'OH',
       OKLAHOMA:	'OK',
       OREGON:	'OR',
       PENNSYLVANIA:	'PA',
       RHODE_ISLAND:	'RI',
       SOUTH_CAROLINA:	'SC',
       SOUTH_DAKOTA:	'SD',
       TENNESSEE:	'TN',
       TEXAS:	'TX',
       UTAH:	'UT',
       VERMONT:	'VT',
       VIRGINIA:	'VA',
       WASHINGTON:	'WA',
       WEST_VIRGINIA:	'WV',
       WISCONSIN:	'WI',
       WYOMING: 'WY'
     }

     this.state = {
       /*states: {

      },*/
      state_index: 0
     }


     /*if(this.firebase_token == ''){
       Async.get('session_token', (token) => {
         this.token = token;
         //dispatchSetFirebaseToken
         console.log("Token: " + token);
         this.props.dispatchSetFirebaseToken(this.token);
       });
     }*/

     // Props for temporary input storage
     //Address, City, State, Zio
     this.addressInput = "";
     this.cityInput ="";
     this.stateInput = "";
     this.stateIndex = 0
     this.zipInput = "";



     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 1,
       numCircles: 4
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: true,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPageX(2, "forward", true) };
     this.onPressLeft = function() { this.props.dispatchSetPageX(0, "backward", null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
     console.log(Object.keys(this.state_list));
     //Mixpanel.timeEvent("Email page Finished");
   }




   onValueChange( value: string) {
     const newState = {};
     newState['state_index'] = value;
     this.setState(newState);
     //Dispatch the state code for states
     this.props.dispatchSetState(Object.values(this.state_list)[value]);
   }


   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Address</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.addressInput = text; this.props.dispatchSetAddress(this.addressInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="email-address" />
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>City</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.cityInput = text; this.props.dispatchSetCity(this.cityInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="email-address" />
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>State</Text>
           {/*TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={"WI"} onChangeText={(text) => {this.stateInput = text; this.props.dispatchSetState(this.stateInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={"johndoe@example.com"} keyboardType="email-address" />*/}
           <Picker
            style={[typography.marginSides, typography.marginBottom]}
            selectedValue={this.state.state_index}
            itemStyle={[typography.stateInput]}
            onValueChange={(text) => { this.onValueChange(text); console.log("State Index: " + this.state.state_index); console.log(Object.keys(this.state_list)[text]); }}>

            {
              Object.keys(this.state_list).map(function(key, value){
                return(
                  <Picker.Item key={key} label={key} value={value}/>
                )
              })
            }

          </Picker>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>PostalCode(ZIP)</Text>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.zipInput = text; this.props.dispatchSetZip(this.zipInput)}} autoCorrect={false}  autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="phone-pad" />
         </View>

           { /* Arrow nav buttons */ }
           <ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} callbackLeft={() => {this.onPressLeft()}} />


           { /* Header */ }
           <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

         </Animated.View>
       </View>
     );
   }
 }

export default Address;

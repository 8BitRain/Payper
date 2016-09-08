import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, DeviceEventEmitter, Image, Picker, Modal} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo";
var Mixpanel = require('react-native-mixpanel');

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";
import EvilIcons from "react-native-vector-icons/EvilIcons";
var Mixpanel = require('react-native-mixpanel');
//import SimplePicker from "react-native-simple-picker";

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";


// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";
import { Dimensions } from 'react-native';




class Address extends React.Component {
   constructor(props) {
     super(props);


     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     this.state_list_options = [
       "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
"KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
"NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
"UT", "VT", "VA", "WA", "WV", "WI", "WY"
     ];

     this.state_list_labels = [
       "ALABAMA",
       "ALASKA",
       "ARIZONA",
       "ARKANSAS",
       "CALIFORNIA",
       "COLORADO",
       "CONNECTICUT",
       "DELAWARE",
       "FLORIDA",
       "GEORGIA",
       "HAWAII",
       "IDAHO",
       "ILLINOIS",
       "INDIANA",
       "IOWA",
       "KANSAS",
       "KENTUCKY",
       "LOUISIANA",
       "MAINE",
       "MARYLAND",
       "MASSACHUSETTS",
       "MICHIGAN",
       "MINNESOTA",
       "MISSISSIPPI",
       "MISSOURI",
       "MONTANA",
       "NEBRASKA",
       "NEVADA",
       "NEW_HAMPSHIRE",
       "NEW_JERSEY",
       "NEW_MEXICO",
       "NEW_YORK",
       "NORTH_CAROLINA",
       "NORTH_DAKOTA",
       "OHIO",
       "OKLAHOMA",
       "OREGON",
       "PENNSYLVANIA",
       "RHODE_ISLAND",
       "SOUTH_CAROLINA",
       "SOUTH_DAKOTA",
       "TENNESSEE",
       "TEXAS",
       "UTAH",
       "VERMONT",
       "VIRGINIA",
       "WASHINGTON",
       "WEST_VIRGINIA",
       "WISCONSIN",
       "WYOMING",
       ];

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
      state_index: 0,
      modalVisible: true
     }

    this.kbOffset = new Animated.Value(0);
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
         "closeIcon": false
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
      console.log(Object.keys(this.state_list));
   }

   componentWillUnmount() {
     _keyboardWillShowSubscription.remove();
     _keyboardWillHideSubscription.remove();
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
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeaderSubSize_1, backgrounds.email]}>
           {/*ADDRESS*/}
           <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Address</Text>
           </View>

           <View>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => { this.addressInput = text; this.props.dispatchSetAddress(this.addressInput); this.props.dispatchSetAddressValidations(this.addressInput); }} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="default" />
             {this.props.addressValidations.valid ? <EvilIcons  style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"  }} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'grey'} />}
           </View>

           {/*CITY*/}
           <View style={{flex: .2, flexDirection: "row", justifyContent: "flex-start"}}>
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>City</Text>
           </View>

           <View>
             <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.cityInput = text; this.props.dispatchSetCity(this.cityInput); this.props.dispatchSetCityValidations(this.cityInput); }} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="default" />
             {this.props.cityValidations.valid ? <EvilIcons  style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'grey'} />}
           </View>
           {/*Has an interesting effect investigate or try using with circles*/}

           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>State</Text>
           <View>
            <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={"WI"} onChangeText={(text) => { this.stateInput = text; this.props.dispatchSetState(this.stateInput)}} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="email-address" />
           </View>

           {/*<Picker
            style={[typography.marginBottom, {backgroundColor: "#d8d8d8", color: "black", marginLeft: 50, marginRight: 50, borderRadius: 50}]}
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

          </Picker>*/}

           {/*POSTAL CODE (ZIP)*/}
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>PostalCode(ZIP)</Text>
         <View>
           <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={""} onChangeText={(text) => {this.zipInput = text; this.props.dispatchSetZip(this.zipInput); this.props.dispatchSetZipValidations(this.zipInput)}} autoCorrect={false}  autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB" placeholder={""} keyboardType="phone-pad" />
           {this.props.zipValidations.valid ? <EvilIcons  style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'grey'} />}
         </View>
         </View>

           { /* Arrow nav buttons */ }
           {/*<ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} callbackLeft={() => {this.onPressLeft()}} />*/}
           { /* Header */ }
           <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

         </Animated.View>
         <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
           <ArrowNav
             arrowNavProps={this.arrowNavProps}
             callbackRight={() => {this.onPressRight()}}
             callbackLeft={() => {this.onPressLeft()}}/>
         </Animated.View>
         {/*<View style={{marginBottom: 0}}>
           <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalVisible}
              style={{marginTop: 0}}
            >

            <Picker
             style={[typography.marginBottom, {backgroundColor: "#d8d8d8", color: "black", marginLeft: 50, marginRight: 50, borderRadius: 50}]}
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
            </Modal>
          </View> */}

       </View>
     );
   }
 }

export default Address;

import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Easing, DeviceEventEmitter, Image, Picker, Modal, TouchableHighlight, TouchableWithoutFeedback, Dimensions} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo";
var Mixpanel = require('react-native-mixpanel');
const { State: TextInputState } = TextInput;
const dismissKeyboard = require('dismissKeyboard');

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";
import EvilIcons from "react-native-vector-icons/EvilIcons";
var Mixpanel = require('react-native-mixpanel');

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";
const dimensions = Dimensions.get('window');

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
        'Alabama':'AL',
        'Alaska':'AK',
        'Arizona':'AZ',
        'Arkansas':'AR',
        'California':'CA',
        'Colorado':'CO',
        'Connecticut':'CT',
        'Delaware':'DE',
        'Florida':'FL',
        'Georgia':'GA',
        'Hawaii':'HI',
        'Idaho':'ID',
        'Illinois':'IL',
        'Indiana':'IN',
        'Iowa':'IA',
        'Kansas':'KS',
        'Kentucky':'KY',
        'Louisiana':'LA',
        'Maine':'ME',
        'Maryland':'MD',
        'Massachusetts':'MA',
        'Michigan':'MI',
        'Minnesota':'MN',
        'Mississippi':'MS',
        'Missouri':'MO',
        'Montana':'MT',
        'Nebraska':'NE',
        'Nevada':'NV',
        'New Hampshire':'NH',
        'New Jersey':'NJ',
        'New Mexico':'NM',
        'New York':'NY',
        'North Carolina':'NC',
        'North Dakota':'ND',
        'Ohio':'OH',
        'Oklahoma':'OK',
        'Oregon':'OR',
        'Pennsylvania':'PA',
        'Rhode Island':'RI',
        'South Carolina':'SC',
        'South Dakota':'SD',
        'Tennessee':'TN',
        'Texas':'TX',
        'Utah':'UT',
        'Vermont':'VT',
        'Virginia':'VA',
        'Washington':'WA',
        'West Virginia':'WV',
        'Wisconsin':'WI',
        'Wyoming':'WY'
     }

     this.state = {
      state_index: 0,
      modalVisible: false,
      focusedInput: "",
    };

    this.kbOffset = new Animated.Value(0);
    this.inputOffsetBottom = new Animated.Value(0);

     //Address, City, State, Zi
     this.addressInput = this.props.dwollaCustomer.address;
     this.cityInput = this.props.dwollaCustomer.city;
     this.stateInput = this.props.dwollaCustomer.state;
     this.stateIndex = 0
     this.zipInput = this.props.dwollaCustomer.zip;

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
       index: 1,
       obsidian: true,
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
     this.onPressRight = function() { this.props.dispatchSetPageX(3, "forward", true) };
     this.onPressLeft = function() { this.props.dispatchSetPageX(1, "backward", null) };
   }

   _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

   _keyboardWillShow(e) {
     // Extend scope
     const _this = this;

     // Determine which TextInput ref to measure
     var refToMeasure;
     switch (this.state.focusedInput) {
       case "addressInput": refToMeasure = this.refs.addressInput;
       break;
       case "cityInput": refToMeasure = this.refs.cityInput;
       break;
       case "stateInput": refToMeasure = this.refs.stateInput;
       break;
       case "zipInput": refToMeasure = this.refs.zipInput;
       break;
     }

     // Shift the input wrap
     refToMeasure.measureInWindow((x, y, width, height) => {
       var kbHeight = e.endCoordinates.height; // Account for 'Continue' button
       var offsetBottom = dimensions.height - y - height;
       var diff = kbHeight - offsetBottom;

       console.log("Keyboard height:", kbHeight);
       console.log("Offset bottom:", offsetBottom);
       console.log("Diff:", diff);

       if (diff > -30) {
         Animated.timing(this.inputOffsetBottom, {
           toValue: (kbHeight + height + 70), // Account for 'Continue' button
           duration: 200,
           easing: Easing.elastic(1),
         }).start();
       }
     });

     if (this.state.focusedInput == "zipInput") {
       Animated.spring(this.kbOffset, {
         toValue: e.endCoordinates.height,
         friction: 6
       }).start();
     } else {
       Animated.spring(this.kbOffset, {
         toValue: 0,
         friction: 6
       }).start();
     }
   }

   _keyboardWillHide(e) {
     Animated.parallel([
       Animated.timing(this.inputOffsetBottom, {
         toValue: 0,
         duration: 200,
         easing: Easing.elastic(1),
       }),
       Animated.spring(this.kbOffset, {
         toValue: 0,
         friction: 6
       }),
     ]).start();
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
     //  Dispatch the state code for states
     this.props.dispatchSetState(Object.values(this.state_list)[value]);
   }


   render() {
     return (
       <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
         <View style={[containers.container, backgrounds.email]}>
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalVisible}>
             <View style={[containers.modalPickerContanier]}>
              <View style={{backgroundColor: "white", height: 45, alignItems: "flex-end", borderBottomColor: "#d8d8d8", borderBottomWidth: 1, justifyContent: "center",}}>
                <Button onPress={() => {
                  console.log("Closing modal...");
                  this._setModalVisible(false);
                }}>
                  <Text style={{color: "black", fontSize: 15, fontWeight: "bold", marginRight:  15}}>Submit</Text>
                </Button>
              </View>

              <Picker
               style={[ {backgroundColor: "white", height: 450}, ]}
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
             </View>
           </Modal>

           { /* Input fields */ }
           <Animated.View {...this.props} style={[containers.justifyCenter, backgrounds.email, { position: 'absolute', top: 0, left: 0, bottom: this.inputOffsetBottom, right: 0, opacity: this.animationProps.fadeAnim }]}>
             { /* Address input */ }
             <View>
               <TextInput ref="addressInput" onFocus={() => this.setState({ focusedInput: "addressInput" })} style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.dwollaCustomer.address} onChangeText={(text) => { this.addressInput = text; this.props.dispatchSetAddress(this.addressInput); this.props.dispatchSetAddressValidations(this.addressInput); }} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" placeholder={"Billing Address Line 1"} keyboardType="default" />
               {this.props.addressValidations.valid ? <EvilIcons  style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"  }} name="check" size={40} color={'green'} /> : <EvilIcons style={{ position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent" }} name="check" size={40} color={'grey'} />}
             </View>

             { /* City input */ }
             <View>
               <TextInput ref="cityInput" onFocus={() => this.setState({ focusedInput: "cityInput" })} style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.dwollaCustomer.city} onChangeText={(text) => {this.cityInput = text; this.props.dispatchSetCity(this.cityInput); this.props.dispatchSetCityValidations(this.cityInput); }} autoCorrect={false}  autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" placeholder={"City"} keyboardType="default" />
               {this.props.cityValidations.valid ? <EvilIcons  style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'grey'} />}
             </View>

             { /* State input */ }
             <View>
              <TextInput ref="stateInput" onFocus={() => { dismissKeyboard(); this._setModalVisible(true); this.setState({ focusedInput: "stateInput" }); }} style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.dwollaCustomer.state  ? this.props.dwollaCustomer.state : "AL"} onChangeText={(text) => { this.stateInput = text; this.props.dispatchSetState(this.stateInput);  }} autoCorrect={false} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" placeholder={"State"} keyboardType="email-address" />
             </View>

             { /* ZIP code input */ }
             <View>
               <TextInput ref="zipInput" onFocus={() => this.setState({ focusedInput: "zipInput" })} style={[typography.textInput, typography.marginSides, typography.marginBottom]}  defaultValue={this.props.dwollaCustomer.zip} onChangeText={(text) => {this.zipInput = text; this.props.dispatchSetZip(this.zipInput); this.props.dispatchSetZipValidations(this.zipInput)}} autoCorrect={false} autoCapitalize="none" placeholderFontFamily="Roboto" placeholderTextColor="#fefeff" maxLength={5} placeholder={"Zip/Postal Code"} keyboardType="numeric" />
               {this.props.zipValidations.valid ? <EvilIcons  style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'green'} /> : <EvilIcons style={{position: "absolute", top: 3.5, left: 305, backgroundColor: "transparent"}} name="check" size={40} color={'grey'} />}
             </View>
           </Animated.View>

           { /* Header */ }
           <Header obsidian callbackBack={() => {this.onPressLeft()}} callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

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
       </TouchableWithoutFeedback>
     );
   }
 }

export default Address;

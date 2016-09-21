import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, DeviceEventEmitter, Image, Modal, TouchableHighlight} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Schema, Actions} from 'react-native-router-flux';
import Entypo from "react-native-vector-icons/Entypo";
var Mixpanel = require('react-native-mixpanel');

// Custom helper functions
import * as Animations from "../../../helpers/animations";
import * as Validators from "../../../helpers/validators";
var Mixpanel = require('react-native-mixpanel');

// Custom components
import Header from "../../../components/Header/Header";
import ArrowNav from "../../../components/Navigation/Arrows/ArrowDouble";
import DatePicker from "react-native-datepicker";

import colors from "../../../styles/colors"

// Stylesheets
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";


class Dob extends React.Component {
   constructor(props) {
     super(props);

     this.kbOffset = new Animated.Value(0);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     // Props for temporary input storage
     this.dobInput = this.props.dwollaCustomer.dob;

     this.state = {
       date:"1992-09-09",
       modalVisible: false
     };

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
       index: 2,
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

  _setDate(date){
    this.setState({date: date});
    this.props.dispatchSetDob(this.state.date);
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
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>When were you born?</Text>
           <DatePicker
              style={{alignSelf: "center"}}
              date={this.state.date}
              mode="date"
              placeholder=""
              format="YYYY-MM-DD"
              minDate="1900-01-02"
              maxDate="2999-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  opacity: 0,
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  height: 60,
                  width: 224,
                  backgroundColor: colors.obsidianInput,
                  paddingLeft: 0,
                  fontFamily: "Roboto",
                  fontWeight: "100",
                  fontSize: 15,
                  color: colors.white,
                  textAlign: "center",
                  alignSelf: "center",
                  borderWidth: 0,
                  borderRadius: 0
                },
                placeholderText: {
                  fontFamily: "Roboto",
                  fontWeight: "100",
                  fontSize: 15,
                  color: colors.white
                },
                dateText: {
                  fontFamily: "Roboto",
                  fontWeight: "100",
                  fontSize: 15,
                  color: colors.white
                },
                dateTouchBody: {
                  height: 60,
                  width: 224,
                  backgroundColor: colors.obsidianInput,
                  paddingLeft: 0,
                  fontFamily: "Roboto",
                  fontWeight: "100",
                  fontSize: 15,
                  color: "white",
                  textAlign: "center",
                  alignSelf: "center",
                  borderWidth: 0,
                  borderRadius: 0
                }

              }}
            onDateChange={(date) => {this._setDate(date)}}
          />
         </View>

           { /* Arrow nav buttons */ }
         {/*<ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} callbackLeft={() => {this.onPressLeft()}}  />*/}


           { /* Header */ }
           <Header callbackBack={() => {this.onPressLeft()}} callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

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

export default Dob;

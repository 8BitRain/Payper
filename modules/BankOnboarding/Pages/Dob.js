import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, DeviceEventEmitter, Image, Modal} from "react-native";
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
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": false
       },
       index: 2,
       title: "Customer Verfication",
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
   }
   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>

         { /* Prompt and input field */ }
         <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
           <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Dob</Text>
           <DatePicker
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
                  height: 40,
                  backgroundColor: "#D8D8D8",
                  padding: 10,
                  paddingLeft: 10,
                  color: "#53585E",
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "transparent"
                },
                dateTouchBody: {
                  height: 40,
                  backgroundColor: "#D8D8D8",
                  padding: 10,
                  paddingLeft: 10,
                  color: "#53585E",
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "transparent"
                }

              }}
            onDateChange={(date) => {this._setDate(date)}}
          />
         </View>

           { /* Arrow nav buttons */ }
         {/*<ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} callbackLeft={() => {this.onPressLeft()}}  />*/}


           { /* Header */ }
           <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />

         </Animated.View>
         <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
           <ArrowNav
             arrowNavProps={this.arrowNavProps}
             callbackRight={() => {this.onPressRight()}}
             callbackLeft={() => {this.onPressLeft()}} />
         </Animated.View>
       </View>
     );
   }
 }

export default Dob;

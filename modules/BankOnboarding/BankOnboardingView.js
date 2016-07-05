import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
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


class TrackingEmpty extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

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

}


   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }

   onThankYouPress() {
     Actions.ThankYouView();
   }

   render() {
     return (

       <Animated.View style={[containers.contentContainer, {opacity: this.animationProps.fadeAnim, backgroundColor: colors.darkGrey}]}>
        <Text>First Name</Text>
        <Text>Last Name</Text>
        <Text>Email</Text>
        <Text> IP Address</Text>
        <Text>Type (personal or business)</Text>
        <Text>Address 1</Text>
        <Text>Address 2</Text>
        <Text>City</Text>
        <Text>State</Text>
        <Text>Postal Code</Text>
        <Text>Date of Birth</Text>
        <Text>SSN</Text>
        <Text>Phone</Text>

       </Animated.View>
     );
   }
 }


const BankOnboardingView = React.createClass({
  render() {
    return(
      <TrackingEmpty  />
    );
  }
});

export default BankOnboardingView;

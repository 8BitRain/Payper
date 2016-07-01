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
var Mixpanel = require('react-native-mixpanel');

class TrackingEmpty extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };
     this.state = {
     bounceValue: new Animated.Value(0),
     animatedStartValue: new Animated.Value(0),
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

 /*Animations */
     bouncingArrow(){
      Animated.sequence([
        Animated.timing(this.state.animatedStartValue, {
          toValue: 55,
          duration: 550,
          delay: 0
        }),
        Animated.timing(this.state.animatedStartValue, {
          toValue: 0,
          duration: 550
        })
      ]).start(() => {
        this.bouncingArrow();
      }
    );
    }

   componentDidMount() {
     Animations.fadeIn(this.animationProps);
     this.state.bounceValue.setValue(1.5);     // Start large
     this.state.animatedStartValue.setValue(0);

     Animated.spring(                          // Base: spring, decay, timing
     this.state.bounceValue,                 // Animate `bounceValue`
     {
      toValue: 50,                         // Animate to smaller size
      friction: 1,                          // Bouncier spring
     }
  ).start();
    this.bouncingArrow();
   }

   onThankYouPress() {

     Mixpanel.track("Completed signup");
     Actions.ThankYouView();
   }

   render() {
     return (

       <Animated.View style={[containers.contentContainer, {opacity: this.animationProps.fadeAnim, backgroundColor: "#292B2E"}]}>

       <Header headerProps={this.headerProps}>
       </Header>
         <View style = {containers.textArrowContainer}>
              <Text style={[typography.fontSizeTitle, typography.marginTop, typography.marginBottom, typography.marginSides]}>Tap the payment button to start using Coincast!</Text>
           <Animated.Text                       // Base: Image, Text, View
          style={{
            width: 64,
            height: 64,
            left: 7,
            transform: [                        // `transform` is an ordered array
              {translateY: this.state.animatedStartValue},  // Map `bounceValue` to `scale`
            ]
          }}>
            <Entypo name="chevron-thin-down" size={48} color="white"/>
          </Animated.Text>

        </View>

        <View style={containers.paymentContainer}>
          <Button onPress={this.onThankYouPress.bind(this)}>
             <View style={{borderRadius: 50, backgroundColor: "white", width: 64, height: 64, overflow: "hidden", alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
                 <Entypo name="credit" size={36} color="black"/>
             </View>
          </Button>
        </View>

       </Animated.View>
     );
   }
 }


const TrackingView = React.createClass({
  render() {
    return(
      <TrackingEmpty  />
    );
  }
});

export default TrackingView;

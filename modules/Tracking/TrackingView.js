import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";


// Houses all typography styles for the Onboarding_CreateAccount module,

const buttons = StyleSheet.create({
  paymentButton: {
    flexDirection: "column",
    flex: .5,
    alignItems: "center",
    justifyContent: "center"
  }
})
const images = StyleSheet.create({
  paymentButton : {
    width: 64,
    height: 64
  }
});
const typo = StyleSheet.create({
  // General typography styles
  general: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "normal",
    color: "#fff"
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 25 },
  fontSizeNote: { fontSize: 20 },
  fontSizeError: { fontSize: 15},

  textInput: {
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
    paddingLeft: 0,
    color: "#fff"
  },

  // Helper styles
  marginLeft: { marginLeft: 20 },
  marginBottom: { marginBottom: 20 },
  marginTop: { marginBottom: 20 },
  marginRight: { marginBottom: 20 },
  marginSides: {
    marginLeft: 20,
    marginRight: 20
  },
  padLeft: { paddingLeft: 20 },
  padBottom: { paddingBottom: 20 },
  padTop: { paddingBottom: 20 },
  padRight: { paddingBottom: 20 }
});

const validation = StyleSheet.create({
  contentContainer : {
    flex: 0.5
  }
});

// Houses all non-typography styles for the OnBoarding_CreateAccount module
const styles = StyleSheet.create({
  // Flex positioning
  container: {
    flex: 1
  },
  contentContainer: {
    flex: .5,
    justifyContent: "center",
    /*marginBottom: 150*/
  },
  // END Flex positioning

  // Page-specific colors
  email: {
    backgroundColor: "#61C9A8"
  },
  password: {
    backgroundColor: "#E83151"
  },
  firstName: {
    backgroundColor: "#67597A"
  },
  lastName: {
    backgroundColor: "#DB5461"
  },
  phoneNumber: {
    backgroundColor: "#576acf"
  },
  summary: {
    backgroundColor: "#67597A"
  }
  // END Page-specific colors
});

// Houses all toolbar styles
const toolbar = StyleSheet.create({
  toolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row",
    flex: 1
  },
  buttonWrap: {
    flex: 0.25,
    alignItems: 'center'
  },
  button: {
    width: 35,
    height: 35
  },
  circleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  circle: {
    width: 10,
    height: 10,
    marginLeft: 2.5,
    marginRight: 2.5
  }
});

/**
  *   Create account onboarding dumb components
  *   Page 0: Email
  *   Page 1: Password
  *   Page 2: First name
  *   Page 3: Last name
  *   Page 4: Phone number
**/
class TrackingEmpty extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
        <View style={styles.contentContainer}>
         <Text style={[typo.fontSizeTitle, typo.marginTop, typo.marginBottom, typo.marginSides]}>Click here to start using Coincast Payments!</Text>
         <Button style={buttons.paymentButton}> <Image style={images.paymentButton} source={require('./assets/money-button64.png')} /></Button>
        </View>
       </Animated.View>
     );
   }
 }

/* END Create account onboarding dumb components */

/**
  *   Create account onboarding smart component
  *
  *   Is passed the current state by CreateAccountViewContainer.js
  *   Renders Page #0 (email),
**/
const TrackingView = React.createClass({
  render() {
        return(
          <TrackingEmpty  />
        )
  }
});

export default TrackingView;

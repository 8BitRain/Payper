import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";
import FacebookLogin from "../../components/FacebookLogin";

// Houses all typography styles for the Onboarding_CreateAccount module
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
class LandingScreenDisplay extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };
     this.emailInput = this.props.email;
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
         <FacebookLogin/>
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
const LandingScreenView= React.createClass({
  render() {
    switch (this.props.currentPage) {
      case 0:
        return(
          <LandingScreenDisplay email={this.props.email} emailValidations={this.props.emailValidations} dispatchSetEmailValidations={(text) => this.props.dispatchSetEmailValidations(Validators.validateEmail(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 1:
        return(
          <OnBoarding_Password password={this.props.password} passwordValidations={this.props.passwordValidations} dispatchSetPasswordValidations={(text) => this.props.dispatchSetPasswordValidations(Validators.validatePassword(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 2:
        return(
          <OnBoarding_FirstName firstName={this.props.firstName} firstNameValidations={this.props.firstNameValidations} dispatchSetFirstNameValidations={(text) => this.props.dispatchSetFirstNameValidations(Validators.validateName(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 3:
        return(
          <OnBoarding_LastName lastName={this.props.lastName} lastNameValidations={this.props.lastNameValidations} dispatchSetLastNameValidations={(text) => this.props.dispatchSetLastNameValidations(Validators.validateName(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 4:
        return(
          <OnBoarding_PhoneNumber phoneNumber={this.props.phoneNumber} phoneNumberValidations={this.props.phoneNumberValidations} dispatchSetPhoneNumberValidations={(text) => this.props.dispatchSetPhoneNumberValidations(text)} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 5:
        return(
          <OnBoarding_Summary createAccount={Firebase.createAccount} currentUser={this.props.currentUser} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
    }
  }
});

export default LandingScreenView;

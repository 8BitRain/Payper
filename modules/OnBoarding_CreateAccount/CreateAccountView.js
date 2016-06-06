import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, Animated} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations.js";
require('./assets/chevron-left.svg');

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

// Houses all non-typography styles for the OnBoarding_CreateAccount module
const styles = StyleSheet.create({
  // Flex positioning
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center"
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
  },
  toolbarButton: {
    width: 70,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto",
    fontWeight: "900"
  },
  toolbarTitle: {
    color: "#fff",
    textAlign: "center",
    flex: 1
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
class OnBoarding_Email extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0), // init opacity 0
     };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
         <View {...this.props} style={[styles.contentContainer, styles.email]}>
           <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Hey, what&#39;s your email?</Text>
           <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} autoCapitalize="none" placeholderFontFamily="Roboto" placeholder={"johndoe@example.com"} keyboardType="email-address" />
         </View>
         <View style={[toolbar.toolbar]}>
           <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(4)}>Prev</Button>
           <Text style={toolbar.toolbarTitle}>. . . . .</Text>
           <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(1)}>Next</Button>
         </View>
       </Animated.View>
     );
   }
 }

class OnBoarding_Password extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0), // init opacity 0
     };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
         <View {...this.props} style={[styles.contentContainer, styles.password]}>
           <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Enter a secure password</Text>
           <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} autoCapitalize="none" placeholderFontFamily="Roboto" placeholder={"not \"password\" :)"} />
         </View>
         <View style={[toolbar.toolbar]}>
           <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(0)}>Prev</Button>
           <Text style={toolbar.toolbarTitle}>. . . . .</Text>
           <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(2)}>Next</Button>
         </View>
       </Animated.View>
     );
   }
 }

 class OnBoarding_FirstName extends React.Component {
  constructor(props) {
    super(props);
    this.animationProps = {
      fadeAnim: new Animated.Value(0), // init opacity 0
    };
  }
  componentDidMount() {
    Animations.fadeIn(this.animationProps);
  }
  render() {
    return (
      <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
        <View {...this.props} style={[styles.contentContainer, styles.firstName]}>
          <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>What&#39;s your first name?</Text>
          <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} placeholderFontFamily="Roboto" placeholder={"John"} />
        </View>
        <View style={[toolbar.toolbar]}>
          <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(1)}>Prev</Button>
          <Text style={toolbar.toolbarTitle}>. . . . .</Text>
          <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(3)}>Next</Button>
        </View>
      </Animated.View>
    );
  }
}

class OnBoarding_LastName extends React.Component {
 constructor(props) {
   super(props);
   this.animationProps = {
     fadeAnim: new Animated.Value(0), // init opacity 0
   };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       <View {...this.props} style={[styles.contentContainer, styles.lastName]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>How &#39;bout your last name?</Text>
         <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} placeholderFontFamily="Roboto" placeholder={"Doe"} />
       </View>
       <View style={[toolbar.toolbar]}>
         <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(2)}>Prev</Button>
         <Text style={toolbar.toolbarTitle}>. . . . .</Text>
         <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(4)}>Next</Button>
       </View>
     </Animated.View>
   );
 }
}

class OnBoarding_PhoneNumber extends React.Component {
 constructor(props) {
   super(props);
   this.animationProps = {
     fadeAnim: new Animated.Value(0), // init opacity 0
   };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       <View {...this.props} style={[styles.contentContainer, styles.phoneNumber]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Can I have your number?</Text>
         <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} placeholderFontFamily="Roboto" placeholder={"262-305-8038"} keyboardType="phone-pad" />
       </View>
       <View style={[toolbar.toolbar]}>
         <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(3)}>Prev</Button>
         <Text style={toolbar.toolbarTitle}>. . . . .</Text>
         <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(5)}>Next</Button>
       </View>
    </Animated.View>
   );
 }
}

class OnBoarding_Summary extends React.Component {
 constructor(props) {
   super(props);
   this.animationProps = {
     fadeAnim: new Animated.Value(0), // init opacity 0
   };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       <View {...this.props} style={[styles.contentContainer, styles.summary]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Does this look right?</Text>

         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>brady.sherid@gmail.com</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>Brady</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>Sheridan</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>1997June2!</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>262-305-8038</Text>

         <Button style={[typo.general, typo.fontSizeNote]} onPress={Actions.CreateAccount}>Yup!</Button>
       </View>
       <View style={[toolbar.toolbar]}>
         <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(4)}><Image source={require('./assets/chevron-left.svg')} /></Button>
         <Text style={toolbar.toolbarTitle}>. . . . .</Text>
         <Button style={toolbar.toolbarButton} onPress={() => this.props.setPage(0)}>Done</Button>
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
const CreateAccountView = React.createClass({
  render() {
    console.log("Props: " + this.props.currentPage);
    console.log("Props: " + this.props.switchPage);
    console.log("Spitting");

    switch (this.props.currentPage) {
      case 0:
        return(
          <OnBoarding_Email setPage={this.props.setPage} />
        )
        break;
      case 1:
        return(
          <OnBoarding_Password setPage={this.props.setPage} />
        )
        break;
      case 2:
        return(
          <OnBoarding_FirstName setPage={this.props.setPage} />
        )
        break;
      case 3:
        return(
          <OnBoarding_LastName setPage={this.props.setPage} />
        )
        break;
      case 4:
        return(
          <OnBoarding_PhoneNumber setPage={this.props.setPage} />
        )
        break;
      case 5:
        return(
          <OnBoarding_Summary setPage={this.props.setPage} />
        )
        break;
    }
  }
});

export default CreateAccountView;

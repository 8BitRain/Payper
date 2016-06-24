import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";

// Custom components
import Header from "../../components/Header/Header";
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";

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
    justifyContent: "center",
    paddingTop: 100
    /*marginBottom: 150*/
  },
  // END Flex positioning
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

const backgrounds = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  email: { backgroundColor: "#61C9A8" },
  password: { backgroundColor: "#E83151" },
  firstName: { backgroundColor: "#67597A" },
  lastName: { backgroundColor: "#DB5461" },
  phoneNumber: { backgroundColor: "#576acf" },
  summary: { backgroundColor: "#67597A" }
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

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     // Props for temporary input storage
     this.emailInput = this.props.email;

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 0,
       numCircles: 6
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: false,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput) };
     this.onPressLeft = function() { this.props.dispatchSetPage(null, null, null, null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
         { /* Background */ }
         <View style={[backgrounds.background, backgrounds.email]}></View>

         { /* Prompt and input field */ }
         <View {...this.props} style={[styles.contentContainer, styles.email, backgrounds.email]}>
           <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Hey, what&#39;s your email?</Text>
           <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput)}} defaultValue={this.props.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmailValidations(this.emailInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholder={"johndoe@example.com"} keyboardType="email-address" />
         </View>

         { /* Arrow nav buttons */ }
         <ArrowNav arrowNavProps={this.arrowNavProps} callbackRight={() => {this.onPressRight()}} />

         { /* Error messages */ }
         <View style={[validation.contentContainer, backgrounds.email]}>
            { this.props.emailValidations.format ? null
              : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Not a valid email</Text> }
            { this.props.emailValidations.duplicate ? <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Email already exists</Text>
              : null }
         </View>

         { /* Header */ }
         <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
       </Animated.View>
     );
   }
 }

class OnBoarding_Password extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     // Props for temporary input storage
     this.passwordInput = this.props.password;

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": true,
         "settingsIcon": false,
         "closeIcon": true
       },
       index: 1,
       numCircles: 6
     };

     // Callback functions to be passed to the header
     this.callbackClose = function() { this.props.callbackClose() };

     // Props to be passed to the arrow nav
     this.arrowNavProps = {
       left: true,
       right: true
     };

     // Callback functions to be passed to the arrow nav
     this.onPressRight = function() { this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput) };
     this.onPressLeft = function() { this.props.dispatchSetPage(0, null, null, null) };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
         { /* Background */ }
         <View style={[backgrounds.background, backgrounds.password]}></View>

         { /* Prompt and input field */ }
         <View {...this.props} style={[styles.contentContainer, backgrounds.password]}>
           <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Enter a secure password</Text>
           <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} defaultValue={this.props.password} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}} onChangeText={(text) => {this.passwordInput = text; this.props.dispatchSetPasswordValidations(this.passwordInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" secureTextEntry={true} placeholder={"not \"password\" :)"} />
         </View>

         { /* Arrow nav buttons */ }
         <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

         { /* Error messages */ }
         <View style={[validation.contentContainer, backgrounds.password]}>
            { this.props.passwordValidations.length ? null
              : function() {
                  if (!this.props.passwordValidations.valid) {
                    console.log("Animate the error message");
                  } else {
                    <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Minimum of 6 chars</Text>
                  }
                }
            }
            { this.props.passwordValidations.lower ? null
              : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Lowercase</Text> }
            { this.props.passwordValidations.upper ? null
              : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Uppercase</Text> }
            { this.props.passwordValidations.num ? null
              : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Number</Text> }
            { this.props.passwordValidations.sym ? null
              : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Symbol</Text> }
         </View>

         { /* Header */ }
         <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
       </Animated.View>
     );
   }
 }

 class OnBoarding_FirstName extends React.Component {
  constructor(props) {
    super(props);

    // Props for animation
    this.animationProps = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };

    // Props for temporary input storage
    this.firstNameInput = this.props.firstName;

    // Props to be passed to the header
    this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": true,
        "settingsIcon": false,
        "closeIcon": true
      },
      index: 2,
      numCircles: 6
    };

    // Props to be passed to the arrow nav
    this.arrowNavProps = {
      left: true,
      right: true
    };

    // Callback functions to be passed to the header
    this.callbackClose = function() { this.props.callbackClose() };

    // Callback functions to be passed to the arrow nav
    this.onPressRight = function() { this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput) };
    this.onPressLeft = function() { this.props.dispatchSetPage(1, null, null, null) };
  }
  componentDidMount() {
    Animations.fadeIn(this.animationProps);
  }
  render() {
    return (
      <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
        { /* Background */ }
        <View style={[backgrounds.background, backgrounds.firstName]}></View>

        { /* Prompt and input field */ }
        <View {...this.props} style={[styles.contentContainer, backgrounds.firstName]}>
          <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>What&#39;s your first name?</Text>
          <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} defaultValue={this.props.firstName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput)}} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstNameValidations(this.firstNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholder={"John"} />
        </View>

        { /* Arrow nav buttons */ }
        <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

        { /* Error messages */ }
        <View style={[validation.contentContainer, backgrounds.firstName]}>
          { this.props.firstNameValidations.capitalized ? null
            : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Not capitalized</Text> }
          { this.props.firstNameValidations.format ? null: <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Invalid character (. and - are allowed)</Text>
             }
        </View>

        { /* Header */ }
        <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
      </Animated.View>
    );
  }
}

class OnBoarding_LastName extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props for temporary input storage
   this.lastNameInput = this.props.lastName;

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": true,
       "settingsIcon": false,
       "closeIcon": true
     },
     index: 3,
     numCircles: 6
   };

   // Callback functions to be passed to the header
   this.callbackClose = function() { this.props.callbackClose() };

   // Props to be passed to the arrow nav
   this.arrowNavProps = {
     left: true,
     right: true
   };

   // Callback functions to be passed to the arrow nav
   this.onPressRight = function() { this.props.dispatchSetPage(4, "forward", this.props.lastNameValidations, this.lastNameInput) };
   this.onPressLeft = function() { this.props.dispatchSetPage(2, null, null, null) };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.lastName]}></View>

       { /* Promp and input field */ }
       <View {...this.props} style={[styles.contentContainer, backgrounds.lastName]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>How &#39;bout your last name?</Text>
         <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} defaultValue={this.props.lastName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(4, "forward", this.props.lastNameValidations, this.lastNameInput)}} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastNameValidations(this.lastNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholder={"Doe"} />
       </View>

       { /* Arrow nav buttons */ }
       <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

       { /* Error messages */ }
       <View style={[validation.contentContainer, backgrounds.lastName]}>
         { this.props.lastNameValidations.capitalized ? null
           : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Not capitalized</Text> }
         { this.props.lastNameValidations.format ? null
           : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Invalid character (. and - are allowed)</Text> }
       </View>

       { /* Header */ }
       <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
     </Animated.View>
   );
 }
}

class OnBoarding_PhoneNumber extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props for temporary input storage
   this.phoneNumberInput = this.props.phoneNumber;

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": true,
       "settingsIcon": false,
       "closeIcon": true
     },
     index: 4,
     numCircles: 6
   };

   // Callback functions to be passed to the header
   this.callbackClose = function() { this.props.callbackClose() };

   // Props to be passed to the arrow nav
   this.arrowNavProps = {
     left: true,
     right: true
   };

   // Callback functions to be passed to the arrow nav
   this.onPressRight = function() { this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput) };
   this.onPressLeft = function() { this.props.dispatchSetPage(3, null, null, null) };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.phoneNumber]}></View>

       { /* Prompt and input field */ }
       <View {...this.props} style={[styles.contentContainer, backgrounds.phoneNumber]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Can I have your number?</Text>
         <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput)}} defaultValue={this.props.phoneNumber} onChangeText={(text) => {this.phoneNumberInput = text}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholder={"262-305-8038"} maxLength={10} keyboardType="phone-pad" />
       </View>

       { /* Arrow nav buttons */ }
       <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackRight={() => {this.onPressRight()}} />

       { /* Header */ }
       <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
    </Animated.View>
   );
 }
}

class OnBoarding_Summary extends React.Component {
 constructor(props) {
   super(props);

   // Props for animation
   this.animationProps = {
     fadeAnim: new Animated.Value(0) // init opacity 0
   };

   // Props to be passed to the header
   this.headerProps = {
     types: {
       "paymentIcons": false,
       "circleIcons": true,
       "settingsIcon": false,
       "closeIcon": true
     },
     index: 5,
     numCircles: 6
   };

   // Callback functions to be passed to the header
   this.callbackClose = function() { this.props.callbackClose() };

   // Props to be passed to the arrow nav
   this.arrowNavProps = {
     left: true,
     right: false,
     check: true
   };

   // Callback functions to be passed to the arrow nav
   this.onPressLeft = function() { this.props.dispatchSetPage(4, null, null, null) };
   this.onPressCheck = function() { this.props.createAccount(this.props.currentUser) };
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, styles.summary, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.summary]}></View>

       { /* Prompt and submit button */ }
       <View {...this.props} style={[styles.contentContainer, backgrounds.summary]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Does this look right?</Text>

         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.email}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.password}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.firstName}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.lastName}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.phoneNumber}</Text>
       </View>

       { /* Arrow nav buttons */ }
       <ArrowNav arrowNavProps={this.arrowNavProps} callbackLeft={() => {this.onPressLeft()}} callbackCheck={() => {this.onPressCheck()}} />

       { /* Header */ }
       <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
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
    switch (this.props.currentPage) {
      case 0:
        return(
          <OnBoarding_Email callbackClose={Actions.landingView} email={this.props.email} emailValidations={this.props.emailValidations} dispatchSetEmailValidations={(text) => this.props.dispatchSetEmailValidations(Validators.validateEmail(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 1:
        return(
          <OnBoarding_Password callbackClose={Actions.landingView} password={this.props.password} passwordValidations={this.props.passwordValidations} dispatchSetPasswordValidations={(text) => this.props.dispatchSetPasswordValidations(Validators.validatePassword(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 2:
        return(
          <OnBoarding_FirstName callbackClose={Actions.landingView} firstName={this.props.firstName} firstNameValidations={this.props.firstNameValidations} dispatchSetFirstNameValidations={(text) => this.props.dispatchSetFirstNameValidations(Validators.validateName(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 3:
        return(
          <OnBoarding_LastName callbackClose={Actions.landingView} lastName={this.props.lastName} lastNameValidations={this.props.lastNameValidations} dispatchSetLastNameValidations={(text) => this.props.dispatchSetLastNameValidations(Validators.validateName(text))} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 4:
        return(
          <OnBoarding_PhoneNumber callbackClose={Actions.landingView} phoneNumber={this.props.phoneNumber} phoneNumberValidations={this.props.phoneNumberValidations} dispatchSetPhoneNumberValidations={(text) => this.props.dispatchSetPhoneNumberValidations(text)} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
      case 5:
        return(
          <OnBoarding_Summary callbackClose={Actions.landingView} createAccount={Actions.TrackingContainer} currentUser={this.props.currentUser} dispatchSetPage={this.props.dispatchSetPage} />
        )
        break;
    }
  }
});

export default CreateAccountView;

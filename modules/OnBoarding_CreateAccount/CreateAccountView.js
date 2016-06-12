import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";

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
class OnBoarding_Email extends React.Component {
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
         <View {...this.props} style={[styles.contentContainer, styles.email]}>
           <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Hey, what&#39;s your email?</Text>
           <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput)}} defaultValue={this.props.email} onChangeText={(text) => {this.emailInput = text; this.props.dispatchSetEmailValidations(this.emailInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" placeholder={"johndoe@example.com"} keyboardType="email-address" />
         </View>
         <View style={[toolbar.toolbar]}>
           <View style={toolbar.buttonWrap}></View>
           <View style={toolbar.circleWrap}>
             <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           </View>
           <View style={toolbar.buttonWrap}>
             <Button style={toolbar.button} onPress={() => this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput)}>Next</Button>
           </View>
         </View>
         <View style={[validation.contentContainer, styles.email]}>
            { this.props.emailValidations.format ? null
              : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Not a valid email</Text> }
            { this.props.emailValidations.duplicate ? <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Email already exists</Text>
              : null }
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
     this.passwordInput = this.props.password;
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
         <View {...this.props} style={[styles.contentContainer, styles.password]}>
           <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Enter a secure password</Text>
           <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} defaultValue={this.props.password} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}} onChangeText={(text) => {this.passwordInput = text; this.props.dispatchSetPasswordValidations(this.passwordInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto" secureTextEntry={true} placeholder={"not \"password\" :)"} />
         </View>
         <View style={[validation.contentContainer, styles.password]}>
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
         <View style={[toolbar.toolbar]}>
           <View style={toolbar.buttonWrap}>
             <Button onPress={() => this.props.dispatchSetPage(0, null, null, null)}><Image style={toolbar.button} source={require('./assets/chevron-left.png')} /></Button>
           </View>
           <View style={toolbar.circleWrap}>
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
             <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           </View>
           <View style={toolbar.buttonWrap}>
             <Button style={toolbar.button} onPress={() => this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}>Next</Button>
           </View>
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
    this.firstNameInput = this.props.firstName;
  }
  componentDidMount() {
    Animations.fadeIn(this.animationProps);
  }
  render() {
    return (
      <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
        <View {...this.props} style={[styles.contentContainer, styles.firstName]}>
          <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>What&#39;s your first name?</Text>
          <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} defaultValue={this.props.firstName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput)}} onChangeText={(text) => {this.firstNameInput = text; this.props.dispatchSetFirstNameValidations(this.firstNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholder={"John"} />
        </View>
        <View style={[validation.contentContainer, styles.firstName]}>
          { this.props.firstNameValidations.capitalized ? null
            : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Not capitalized</Text> }
          { this.props.firstNameValidations.format ? null: <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Invalid character (. and - are allowed)</Text>
             }
        </View>
        <View style={[toolbar.toolbar]}>
          <View style={toolbar.buttonWrap}>
            <Button onPress={() => this.props.dispatchSetPage(1, null, null, null)}><Image style={toolbar.button} source={require('./assets/chevron-left.png')} /></Button>
          </View>
          <View style={toolbar.circleWrap}>
            <Image style={toolbar.circle} source={require('./assets/circle.png')} />
            <Image style={toolbar.circle} source={require('./assets/circle.png')} />
            <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
            <Image style={toolbar.circle} source={require('./assets/circle.png')} />
            <Image style={toolbar.circle} source={require('./assets/circle.png')} />
            <Image style={toolbar.circle} source={require('./assets/circle.png')} />
          </View>
          <View style={toolbar.buttonWrap}>
            <Button style={toolbar.button} onPress={() => this.props.dispatchSetPage(3, "forward", this.props.firstNameValidations, this.firstNameInput)}>Next</Button>
          </View>
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
   this.lastNameInput = this.props.lastName;
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       <View {...this.props} style={[styles.contentContainer, styles.lastName]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>How &#39;bout your last name?</Text>
         <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} defaultValue={this.props.lastName} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(4, "forward", this.props.lastNameValidations, this.lastNameInput)}} onChangeText={(text) => {this.lastNameInput = text; this.props.dispatchSetLastNameValidations(this.lastNameInput)}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholder={"Doe"} />
       </View>
       <View style={[validation.contentContainer, styles.lastName]}>
         { this.props.lastNameValidations.capitalized ? null
           : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Not capitalized</Text> }
         { this.props.lastNameValidations.format ? null
           : <Text style={[typo.general, typo.fontSizeError, typo.marginSides]}>Invalid character (. and - are allowed)</Text> }
       </View>
       <View style={[toolbar.toolbar]}>
         <View style={toolbar.buttonWrap}>
           <Button onPress={() => this.props.dispatchSetPage(2, null, null, null)}><Image style={toolbar.button} source={require('./assets/chevron-left.png')} /></Button>
         </View>
         <View style={toolbar.circleWrap}>
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
         </View>
         <View style={toolbar.buttonWrap}>
           <Button style={toolbar.button} onPress={() => this.props.dispatchSetPage(4, "forward", this.props.lastNameValidations, this.lastNameInput)}>Next</Button>
         </View>
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
   this.phoneNumberInput = this.props.phoneNumber;
 }
 componentDidMount() {
   Animations.fadeIn(this.animationProps);
 }
 render() {
   return (
     <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
       <View {...this.props} style={[styles.contentContainer, styles.phoneNumber]}>
         <Text style={[typo.general, typo.fontSizeTitle, typo.marginSides, typo.marginBottom]}>Can I have your number?</Text>
         <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom]} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput)}} defaultValue={this.props.phoneNumber} onChangeText={(text) => {this.phoneNumberInput = text}} autoCorrect={false} autoFocus={true} placeholderFontFamily="Roboto" placeholder={"262-305-8038"} maxLength={10} keyboardType="phone-pad" />
       </View>
       <View style={[toolbar.toolbar]}>
         <View style={toolbar.buttonWrap}>
           <Button onPress={() => this.props.dispatchSetPage(3, null, null, null)}><Image style={toolbar.button} source={require('./assets/chevron-left.png')} /></Button>
         </View>
         <View style={toolbar.circleWrap}>
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
         </View>
         <View style={toolbar.buttonWrap}>
           <Button style={toolbar.button} onPress={() => this.props.dispatchSetPage(5, "forward", {valid: true}, this.phoneNumberInput)}>Next</Button>
         </View>
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

         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.email}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.password}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.firstName}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.lastName}</Text>
         <Text style={[typo.general, typo.fontSizeNote, typo.marginSides, typo.marginBottom]}>{this.props.currentUser.phoneNumber}</Text>

         <Button style={[typo.general, typo.fontSizeNote]} onPress={() => this.props.createAccount(this.props.currentUser)}>Yup!</Button>
       </View>
       <View style={[toolbar.toolbar]}>
         <View style={toolbar.buttonWrap}>
           <Button onPress={() => this.props.dispatchSetPage(4, null, null, null)}><Image style={toolbar.button} source={require('./assets/chevron-left.png')} /></Button>
         </View>
         <View style={toolbar.circleWrap}>
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle.png')} />
           <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
         </View>
         <View style={toolbar.buttonWrap}></View>
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
    switch (this.props.currentPage) {
      case 0:
        return(
          <OnBoarding_Email email={this.props.email} emailValidations={this.props.emailValidations} dispatchSetEmailValidations={(text) => this.props.dispatchSetEmailValidations(Validators.validateEmail(text))} dispatchSetPage={this.props.dispatchSetPage} />
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

export default CreateAccountView;

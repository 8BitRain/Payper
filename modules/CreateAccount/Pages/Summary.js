import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Linking} from 'react-native';
import Button from 'react-native-button';
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from '../../../helpers/animations';
import * as Validators from '../../../helpers/validators';
import * as Init from '../../../_init';

// Custom components
import Header from '../../../components/Header/Header';
import ArrowNav from '../../../components/Navigation/Arrows/ArrowDouble';
var Mixpanel = require('react-native-mixpanel');
import Hyperlink from 'react-native-hyperlink';

// Stylesheets
import colors from '../../../styles/colors';
import backgrounds from '../styles/backgrounds';
import containers from '../styles/containers';
import typography from '../styles/typography';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialIcons'

class Summary extends React.Component {
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
       "circleIcons": false,
       "settingsIcon": false,
       "closeIcon": false,
       "backIcon": true,
       "appLogo": true
     },
     index: 5,
     obsidian: true,
     numCircles: 6
   };

   this.state = {
     isChecked: false,
     isRadioSelected: true,
   };



   // Callback functions to be passed to the header
   this.callbackClose = function() { this.props.callbackClose() };

   // Props to be passed to the arrow nav
   this.arrowNavProps = {
     left: true,
     right: false,
     check: false
   };

   // Callback functions to be passed to the arrow nav
   this.onPressLeft = function() { this.props.dispatchSetPage(4, null, null, null) };
   this.onPressCheck = function() {
     var _this = this;
     Init.createUser(this.props.newUser, function(userCreated, token){
       if(userCreated){
         console.log("SUMMARY SCREEN: TOKEN (Standalone from USERTOKEN): " + _this.props.token)
         console.log("SUMMARY SCREEN: USER TOKEN BEFORE DISPATCH: " + _this.props.newUser.token);
         console.log("SUMMARY SCREEN: USER TOKEN: " + token);
         _this.props.dispatchSetNewUserToken(token);
         console.log("SUMMARY SCREEN: USER TOKEN AFTER DISPATCH" + _this.props.newUser.token);
         Actions.BankOnboardingContainer();
       }
     });
   };
 }

  handlePressCheckedBox = (checked) => {

    // Extend scope
    const _this = this;

    // Update check box
    this.setState({ isChecked: checked });

    // Create user, dispatch jwt to Redux store, and redirect to bank onboarding flow
    Init.createUser(this.props.newUser, function(userCreated, token) {
      if (userCreated) {
        console.log("createUser returned token:", token);
        _this.props.dispatchSetNewUserToken(token);
        Actions.BankOnboardingContainer();
      }
    });

  }

  handleUrlClick = (url) =>{
    Linking.openURL(url).catch(err => console.error('An error occurred', err));

  }

 componentDidMount() {
   Animations.fadeIn(this.animationProps);
   Mixpanel.track("Phone# page Finished");

 }
 render() {
   return (
     <Animated.View style={[containers.container, containers.summary, {opacity: this.animationProps.fadeAnim}]}>
       { /* Background */ }
       <View style={[backgrounds.background, backgrounds.summary]}></View>

       { /* Prompt and submit button */ }
       <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.summary]}>
         <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Does this look right?</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.newUser.email}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.newUser.password}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.newUser.firstName}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.newUser.lastName}</Text>
         <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, typography.marginBottom]}>{this.props.newUser.phone}</Text>

        { /* Prompt and Checkbox*/}
        <View style={{padding: 20, alignItems: "center"}}>
           <Hyperlink
             onPress={(url) => this.handleUrlClick(url) } linkStyle={{color:'#2980b9', fontSize:14}}
             linkText={ (url) => {
               if (url === 'https://www.dwolla.com/legal/tos') {
                 return 'Terms of Service';
               } else if (url === 'https://www.dwolla.com/legal/privacy') {
                 return 'Privacy Policy';
               }
             }}>
             <Text
               style={{
                 fontFamily: 'Roboto',
                 fontSize: 14,
                 color: colors.white,
                 fontWeight: '100',
               }}>
               { "Our trusted partner Dwolla handles secure bank to bank payments. By clicking the box below you accept Dwolla's https://www.dwolla.com/legal/tos and https://www.dwolla.com/legal/privacy." }
             </Text>
           </Hyperlink>
         </View>

         <View style={{alignItems: "center"}}>
           <Button style={{alignSelf: "center"}} onPress={()=> {this.handlePressCheckedBox(true)}}>
            {this.state.isChecked ? <Material name="check-box" size={32} color={colors.white} /> : <Material name="check-box-outline-blank" size={32} color={colors.white} />}
           </Button>
         </View>

       </View>


       { /* Header */ }
       <Header callbackBack={() => {this.onPressLeft()}} callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />
     </Animated.View>
   );
 }
}

export default Summary;

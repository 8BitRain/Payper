// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Easing, DeviceEventEmitter, Image, TouchableHighlight, Dimensions } from 'react-native';
import Button from 'react-native-button';
import { Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';
var Mixpanel = require('react-native-mixpanel');

// Helpers
import * as Init from '../../../_init';
import * as Animations from '../../../helpers/animations';
import * as Validators from '../../../helpers/validators';
import * as Async from '../../../helpers/Async';
import * as Firebase from '../../../services/Firebase';

// Components
import Header from '../../../components/Header/Header';
import ArrowNav from '../../../components/Navigation/Arrows/ArrowDouble';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Loading from '../../../components/Loading/Loading';

// Stylesheets
import backgrounds from '../styles/backgrounds';
import containers from '../styles/containers';
import typography from '../styles/typography';
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

class SSN extends React.Component {
   constructor(props) {
     super(props);

     // Props for animation
     this.kbOffset = new Animated.Value(0);

     console.log("SSN received new user token:", this.props.newUser.token);

     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

     this.loadingOpacity = new Animated.Value(0);

     /*if(this.firebase_token == ''){
       Async.get('session_token', (token) => {
         this.token = token;
         //dispatchSetFirebaseToken
         console.log("Token: " + token);
         this.props.dispatchSetFirebaseToken(this.token);
       });
     }*/

     // Props for temporary input storage
     this.SSNInput = this.props.dwollaCustomer.ssn;
     this.uid = "";

     // Props to be passed to the header
     this.headerProps = {
       types: {
         "paymentIcons": false,
         "circleIcons": false,
         "settingsIcon": false,
         "closeIcon": false,
         "backIcon" : true,
         "appLogo" : true
       },
       index: 3,
       obsidian: true,
       numCircles: 4
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
     this.onPressLeft = function() { this.props.dispatchSetPageX(3, "backward", null) };
     this.onPressCheck = function(){
       var data = {
         "firstName": this.props.dwollaCustomer.firstName,
         "lastName": this.props.dwollaCustomer.lastName,
         "email": this.props.dwollaCustomer.email,
         "phone": this.props.dwollaCustomer.phone,
         "address": this.props.dwollaCustomer.address,
         "city": this.props.dwollaCustomer.city,
         "state": this.props.dwollaCustomer.state,
         "zip": this.props.dwollaCustomer.zip,
         "dob": this.props.dwollaCustomer.dob,
         "ssn": this.props.dwollaCustomer.ssn,
         "token": this.props.newUser.token
       }
       this.createCustomer(data);

     }

     this.state = {
       loading: false,
     }
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
      this.props.stopListening(this.props.activeFirebaseListeners);
   }

   createCustomer(data){
     //data.token = {this.props.firebase_token};
     console.log("FirebaseToken: " + this.props.newUser.token);
     //console.log("DataToken: " + data.token);
     var _this = this;
     Init.createCustomer(data, function(customerCreated){
       console.log("CustomerCreated?: " + customerCreated);
       //Loading Screen to IAV
       if(customerCreated){
          _this.props.dispatchSetLoading(true);
       }
       //Grab UId
       Async.get('user', (val) => {
           console.log("User: " + val);
           console.log("User: " + JSON.parse(val).uid);
         var iav = "IAV/" + JSON.parse(val).uid;
         var appFlags = "appFlags/" + JSON.parse(val).uid;
         //Enable FirebaseListeners
         _this.props.listen([appFlags, iav]);
         //dispatch will be called from container
       });
      // _this.initiateIAV(_this.props.newUser.token, _this);
     });
   }

   /*initiateIAV(token, _this){
      var data = {
        token: token
      };
      //var _this = this;
      console.log("Beginning IAV Initiation");
      Init.getIavToken(data, function(iavTokenRecieved, iavToken){
        if(iavTokenRecieved){
          console.log("SSN IAVTOKEN: " + JSON.stringify(iavToken));
          //Will cause the IAV Token Page to be loaded
          _this.props.dispatchSetLoading(true);
          _this.props.dispatchSetIav(iavToken.token);
        }
      });
   }*/

   _showLoadingScreen() {
     this.setState({ loading: true });

     Animated.timing(this.loadingOpacity, {
       toValue: 1.0,
       duration: 300,
       easing: Easing.elastic(1),
     }).start();
   }

   render() {
     return (
       <View style={[containers.container, backgrounds.email]}>
         <Animated.View style={{opacity: this.animationProps.fadeAnim}}>
           <View {...this.props} style={[containers.quo, containers.justifyCenter, containers.padHeader, backgrounds.email]}>
             <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>What are the last 4 digits of your Social Security Number?</Text>
             <TextInput
                style={[typography.textInput, typography.marginSides, typography.marginBottom]}
                defaultValue={this.props.dwollaCustomer.ssn}
                onChangeText={(text) => {this.SSNInput = text; this.props.dispatchSetSSN(this.SSNInput)}}
                autoCorrect={false} autoFocus={true} autoCapitalize="none"
                placeholderFontFamily="Roboto" placeholderTextColor="#99ECFB"
                maxLength={4} placeholder={""} keyboardType="number-pad" />
           </View>

           { /* Header */ }
           <Header obsidian callbackBack={() => {this.onPressLeft()}} callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
         </Animated.View>

         { /* Continue button */ }
         <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
           <TouchableHighlight
             activeOpacity={0.8}
             underlayColor={'transparent'}
             onPress={() => { this.onPressCheck(); this._showLoadingScreen(); }}>

             <Animated.View style={{ height: 70, backgroundColor: "#20BF55", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <Text style={[typography.button, { alignSelf: 'center', textAlign: 'center', color: "#fefeff" }]}>
                  Continue
               </Text>
             </Animated.View>

           </TouchableHighlight>
         </Animated.View>

         { /* Loading screen */
           (this.state.loading)
            ? <Animated.View style={{ opacity: this.loadingOpacity, height: dimensions.height, width: dimensions.width, backgroundColor: colors.white, position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 26, fontFamily: 'Roboto', fontWeight: '200', color: colors.richBlack, padding: 15, alignText: 'center' }}>
                  Hold on while we catch our breath...
                </Text>
              </Animated.View>
            : null }
         {/*<Modal animationType={"slide"} transparent={true} visible={this.props.loading}>
            <Loading
              complete={this.props.done_loading}
              msgSuccess={""}
              msgError={"There was an error on our end. Sorry about that ^_^;"}
              msgLoading={"One moment..."}
              success={true}
              successDestination={() => {console.log("SucessfullLoading")}}
              errorDestination={() => {console.log("temp loading screen")}}
            />
         </Modal>*/}
       </View>
     );
   }
 }

export default SSN;

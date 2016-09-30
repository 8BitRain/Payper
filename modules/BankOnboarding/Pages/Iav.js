import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView, Linking, Modal} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Schema, Actions} from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';
import TimerMixin from 'react-timer-mixin';


import * as Async from '../../../helpers/Async';

//styles
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";
import colors from '../../../styles/colors';

//components
import Loading from "../../../components/Loading/Loading";



var Mixpanel = require('react-native-mixpanel');


class Iav extends React.Component {
  constructor(props) {
    super(props);
    this.firebase_token =  this.props.newUser.token;
    if(this.firebase_token == ''){
      console.log("Async Error: Make sure Firebase token is properly being stored and retrieved via dispatch");
    }
    /*
    * IAV FLOW
    * 1.) Client needs to check to see if the IAV has been correctly loaded. This can be done within
    *     the iav.html code. Should require some check for the div being loaded. Iav.html should include a
    *     loading animation, as well as some text explaining what is being loaded?
    * 2.) Once the IAV is loaded allow the user to carry through with the sign up process.
    * 3.) On completion handle the different callback cases
    *       Invalid IAV Token -
    *       Unexpected Page Error -
    *       Too many attempts with single IAV Token - ?
    *       Unsupported Bank - Fallback to microDeposits
    */
    //Attempt that causes looping of code in webview
    this.injectedJS = 'var firebase_token = ' + "'" + this.firebase_token + "'" + ';' + ' var iav_token = ' + "'" + this.props.startIav + "'" + ';' + ' $( document ).ready(function() { generateIAVToken()});';

    console.log(this.injectedJS);
  }

  injectJS(){
    console.log("injectedJS Code: " + this.injectedJS);
    this.numInjectedJSCalls +=1;
    console.log("number of times injectedJS ran" + this.numInjectedJSCalls);
    return (JSON.stringify(this.injectedJS));
  }

  errorRender(){
    console.log("There was an error :()");
  }

  componentWillMount() {
    // Initialize the app
    var _this = this;

    Async.get('user', (val) => {
      console.log("User: " + val);
      console.log("User: " + JSON.parse(val).uid);
      //Listen for microdeposits first
      var micro_deposit_flow = "appFlags/" + JSON.parse(val).uid;

      //Need to listen to fundingSourceAdded and IAV so

      var fundingSourceAdded = "IAV/" + JSON.parse(val).uid;

      _this.props.listen([fundingSourceAdded, micro_deposit_flow]);
    });
  }

  componentDidMount(){
    var _this = this;
    setTimeout(() => {
      console.log("IAV LOADING SCREEN SETS TIMEOUT");
      _this.closeLoadingModals();
    }, 5000);
  }

  closeLoadingModals(){
    this.props.dispatchSetDoneLoading(true);
    this.props.dispatchSetLoading(false);
  }
  componentWillUnmount() {
    // Disable Firebase listeners
    this.props.dispatchSetIav("");
    this.props.stopListening(this.props.activeFirebaseListeners);
  }

  render() {
      return(
        <View style={{flex: 1}}>
        <WebView
         source={{uri: 'http://www.getpayper.io/iav'}} injectedJavaScript={this.injectedJS}
         style={{marginTop: 20}}
         startInLoadingState={false}
       />
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

export default Iav;

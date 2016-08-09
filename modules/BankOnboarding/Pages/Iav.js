import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';


//styles
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";
import colors from '../../../styles/colors';



var Mixpanel = require('react-native-mixpanel');

class Iav extends React.Component {
  constructor(props) {
    super(props);
    this.firebase_token =  this.props.currentUser.token;
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
  render() {
    return(
      <WebView
       source={{uri: /*'http://localhost:8000'*/ /*'http://localhost:5000/iav'*/ 'http://www.getpayper.io/iav'}} injectedJavaScript={this.injectedJS}
       style={{marginTop: 20}}
       startInLoadingState={false}
     />
    );
  }
}

export default Iav;

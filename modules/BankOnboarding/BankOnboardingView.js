import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";
import * as Async from "../../helpers/Async";
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/Header/Header.js';
/*import WebViewBridge from 'react-native-webview-bridge';*/

//components
import BasicInfo from "./Pages/BasicInfo";
import Address from "./Pages/Address";
import Dob from "./Pages/Dob";
import SSN from "./Pages/SSN";
import Iav from "./Pages/Iav";

//styles
import backgrounds from "./styles/backgrounds";
import containers from "./styles/containers";
import typography from "./styles/typography";
import colors from '../../styles/colors';



var Mixpanel = require('react-native-mixpanel');



    /*submitFundingSource(){
      var data = {
        routingNumber: this.routing,
        accountNumber: this.account,
        accountType: this.type,
        accountName: this.name,
        token: this.token
      }


      console.log(data);
      var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/addFundingSource';
      fetch(url, {method: "POST", body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((responseData) => {
        //AsyncStorage.setItem("@Store:session_key", token);
        console.log(responseData);
      })
      .done();

    }

    removeFundingSource(){
      var data = {
        token: this.token1
      };

      var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/removeFundingSource';
      fetch(url, {method: "POST", body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((responseData) => {
        //AsyncStorage.setItem("@Store:session_key", token);
        console.log(responseData);
      })
      .done();
    }*/

const BankOnboardingView = React.createClass({
  render() {
    if(this.props.startIav == ''){
        console.log("BankOnboardingView: token: " + this.props.newUser.token);
        //this.props.dispatchSetFirebaseToken("eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2MjVmZTczN2YwMTJmZTNmZDgzMjYyZjIxOGE1NTI1MjVmNTExNWYifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWJhc2UtY29pbmNhc3QiLCJhdWQiOiJmaXJlYmFzZS1jb2luY2FzdCIsImF1dGhfdGltZSI6MTQ3MDM0MDk4NiwidXNlcl9pZCI6Im4zb3puRFJ2bUJib3Z0N1ZpbVdOcHRaUlhScTEiLCJzdWIiOiJuM296bkRSdm1CYm92dDdWaW1XTnB0WlJYUnExIiwiaWF0IjoxNDcwMzQwOTg3LCJleHAiOjE0NzAzNDQ1ODcsImVtYWlsIjoidGVzdGVyM0B3aXNjLmVkdSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0ZXIzQHdpc2MuZWR1IiwidGVzdGVyM0B3aXNjLmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.luyfhUg6wCx0g8T4jcHeU-LhJsoH_jlU5vvoKzfUVZyZm9C8gT2LxXD_MJjwGkGHzWa7kiVTt7FV0-BLX4t884XSJHPjBummJNnwWINgvbOROj7wkIMK15ZfQe149iGcXDQTJls3JEqfc9u_Iy87IX79Nm5SEnhe8UhS-UR0XP5wbXVygIfKPj4q3Ssp5ap-cs78b0p1M1-f49mUg1bcG3Lzc4wg5PVMGyxhQeu6KCiD_Aj3uyBYlW5bRCSXIHkGOUJCKxSAjYedroxC4xsFwMPEqjN1s49mnT3XZvetRUO4piShDSXYbtd_JKJrFdo-Bs9NyzLOHO56MNGQndhplw");
        switch(this.props.currentPagex){
          case 0:
            return(
              <BasicInfo
                newUser={this.props.newUser}
                dispatchSetFirstName={this.props.dispatchSetFirstName}
                dispatchSetLastName={this.props.dispatchSetLastName}
                dispatchSetEmail={this.props.dispatchSetEmail}
                dispatchSetPhone={this.props.dispatchSetPhone}
                dispatchSetPageX={this.props.dispatchSetPageX}
                callbackClose={Actions.landingView}
              />
            )
            break;
          case 1:
            return(
              <Address
                dispatchSetAddress={this.props.dispatchSetAddress}
                dispatchSetCity={this.props.dispatchSetCity}
                dispatchSetState={this.props.dispatchSetState}
                dispatchSetZip={this.props.dispatchSetZip}
                dispatchSetPageX={this.props.dispatchSetPageX}
                callbackClose={Actions.landingView}
              />
            )
            break;
          case 2:
            return(
              <Dob
                dispatchSetDob={this.props.dispatchSetDob}
                dispatchSetPageX={this.props.dispatchSetPageX}
                callbackClose={Actions.landingView}
              />
            )
            break;
          case 3:
            return(
              <SSN
                dispatchSetSSN={this.props.dispatchSetSSN}
                dispatchSetPageX={this.props.dispatchSetPageX}
                callbackClose={Actions.landingView}
                dwollaCustomer={this.props.dwollaCustomer}
                newUser={this.props.newUser}
                dispatchSetIav={this.props.dispatchSetIav}
                listen={this.props.listen}
                stopListening={this.props.stopListening}
                activeFirebaseListeners={this.props.activeFirebaseListeners}
              />
            )
            break;
        }
        //<OnBoardingSummaryTest  firebase_token = {this.props.firebase_token} startIav={this.props.startIav} dispatchSetIav={this.props.dispatchSetIav} dispatchSetFirebaseToken={this.props.dispatchSetFirebaseToken}/>
    } else {
      console.log("IAV: " + this.props.startIav);
      return(
        <Iav newUser={this.props.newUser} startIav={this.props.startIav}/>
      )
    }
  }
});

export default BankOnboardingView;

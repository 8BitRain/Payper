import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView, Linking} from "react-native";
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
import VerifyMicrodeposit from "./Pages/VerifyMicrodeposit";

//styles
import backgrounds from "./styles/backgrounds";
import containers from "./styles/containers";
import typography from "./styles/typography";
import colors from '../../styles/colors';


import Loading from "../../components/Loading/Loading";
var Mixpanel = require('react-native-mixpanel');

class LoadingView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      doneLoading: false,
      signInSuccess: false,
    }
  }

  render() {
    return(
      <Loading
        complete={true}
        msgSuccess={"Welcome!"}
        msgError={""}
        msgLoading={"Loading"}
        success={true}
        successDestination={() => Actions.MainViewContainer()}
        errorDestination={() => Actions.BankOnboardingContainer()} />
    );
  }
}

class RetryModal extends React.Component {
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
        "closeIcon": true
      },
      index: 0,
      title: "Retry Status",
      numCircles: 0
    };
    this.state = {

    }

    this.callbackClose = function() { this.props.callbackClose() };
  }

  render() {
    return(
      <View style={[containers.container, backgrounds.email, containers.quo]}>
          <View style={{marginTop: 100}}>
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {marginTop: 0}]}>Please double check the information you provided us. Closing this screen will take you back to the input fields. </Text>
          </View>
            <Header callbackClose={() => {this.props.dispatchSetPageX(0, "backward", null); this.props.dispatchSetRetry(false); }} headerProps={this.headerProps} />
      </View>
    )
  }
}

class DocumentModal extends React.Component {
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
        "closeIcon": true
      },
      index: 0,
      title: "Additional Documents Required",
      numCircles: 0
    };
    this.state = {

    }

    this.callbackClose = function() { this.props.callbackClose() };
  }

  render() {
    return(
      <View style={[containers.container, backgrounds.email, containers.quo]}>
          <View style={{marginTop: 100}}>
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {marginTop: 0}]}>Our partner, Dwolla, needs extra information to verify your identity. Please check your email (Payper) for the next steps.</Text>
          </View>
            <Header callbackClose={() => {Actions.MainViewContainer()}} headerProps={this.headerProps} />
      </View>
    );
  }
}

class SuspendedModal extends React.Component {
  constructor(props) {
    super(props);

    // Props for animation
    this.animationProps = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };

    this.callbackClose = function() { this.props.callbackClose() };
    // Props to be passed to the header
    this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": false,
        "settingsIcon": false,
        "closeIcon": true
      },
      index: 0,
      title: "Suspended Account",
      numCircles: 0
    };
    this.state = {

    }
  }

  render() {
    return(
      <View style={[containers.container, backgrounds.email, containers.quo]}>
          <View style={{marginTop: 100}}>
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {marginTop: 0}]}>It seems you''re an outlaw, please contact support.</Text>
          </View>
            <Header callbackClose={() => {Actions.LandingScreenContainer()}} headerProps={this.headerProps} />
      </View>
    );
  }
}

class BankOnboardingView extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructing BankOnboardingView with props:", this.props);
  }

  render() {
    if(this.props.loading){
      return(
        <Loading
          complete={this.props.doneLoading}
          msgSuccess={""}
          msgError={"There was an error on our end. Sorry about that ^_^;"}
          msgLoading={"One moment..."}
          success={false}
          successDestination={() => {console.log("SucessfullLoading")}}
          errorDestination={() => {console.log("temp loading screen")}} />
      );
    }
    if(this.props.startIav == '' && this.props.startMain == false && !this.props.retry && !this.props.document && !this.props.suspended){
        //this.props.dispatchSetFirebaseToken("eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2MjVmZTczN2YwMTJmZTNmZDgzMjYyZjIxOGE1NTI1MjVmNTExNWYifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWJhc2UtY29pbmNhc3QiLCJhdWQiOiJmaXJlYmFzZS1jb2luY2FzdCIsImF1dGhfdGltZSI6MTQ3MDM0MDk4NiwidXNlcl9pZCI6Im4zb3puRFJ2bUJib3Z0N1ZpbVdOcHRaUlhScTEiLCJzdWIiOiJuM296bkRSdm1CYm92dDdWaW1XTnB0WlJYUnExIiwiaWF0IjoxNDcwMzQwOTg3LCJleHAiOjE0NzAzNDQ1ODcsImVtYWlsIjoidGVzdGVyM0B3aXNjLmVkdSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0ZXIzQHdpc2MuZWR1IiwidGVzdGVyM0B3aXNjLmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.luyfhUg6wCx0g8T4jcHeU-LhJsoH_jlU5vvoKzfUVZyZm9C8gT2LxXD_MJjwGkGHzWa7kiVTt7FV0-BLX4t884XSJHPjBummJNnwWINgvbOROj7wkIMK15ZfQe149iGcXDQTJls3JEqfc9u_Iy87IX79Nm5SEnhe8UhS-UR0XP5wbXVygIfKPj4q3Ssp5ap-cs78b0p1M1-f49mUg1bcG3Lzc4wg5PVMGyxhQeu6KCiD_Aj3uyBYlW5bRCSXIHkGOUJCKxSAjYedroxC4xsFwMPEqjN1s49mnT3XZvetRUO4piShDSXYbtd_JKJrFdo-Bs9NyzLOHO56MNGQndhplw");
        switch(this.props.currentPagex){
          case 0:
            return(
              <BasicInfo
                newUser={this.props.newUser}
                dwollaCustomer={this.props.dwollaCustomer}
                dispatchSetFirstName={this.props.dispatchSetFirstName}
                dispatchSetLastName={this.props.dispatchSetLastName}
                dispatchSetEmail={this.props.dispatchSetEmail}
                dispatchSetPhone={this.props.dispatchSetPhone}
                dispatchSetPageX={this.props.dispatchSetPageX}
                dispatchSetCPhoneValidations={(text) => this.props.dispatchSetCPhoneValidations(Validators.validatePhone(text))}
                dispatchSetCEmailValidations={(text) => this.props.dispatchSetCEmailValidations(Validators.validateEmail(text))}
                dispatchSetCFirstNameValidations={(text) => this.props.dispatchSetCFirstNameValidations(Validators.validateName(text))}
                dispatchSetCLastNameValidations={(text) => this.props.dispatchSetCLastNameValidations(Validators.validateName(text))}
                dispatchSetBasicInfoValidations={(firstName, lastName, email, phone) => this.props.dispatchSetBasicInfoValidations(Validators.validateBasicInfo(firstName, lastName, email, phone))}
                basicInfoValidations={this.props.basicInfoValidations}
                cemailValidations={this.props.cemailValidations}
                cfirstNameValidations={this.props.cfirstNameValidations}
                clastNameValidations={this.props.clastNameValidations}
                cphoneValidations={this.props.cphoneValidations}

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
                dispatchSetAddressValidations={(text) => this.props.dispatchSetAddressValidations(Validators.validateAddress(text))}
                dispatchSetCityValidations={(text) => this.props.dispatchSetCityValidations(Validators.validateCity(text))}
                dispatchSetZipValidations={(text) => this.props.dispatchSetZipValidations(Validators.validatePostalCode(text))}
                addressValidations = {this.props.addressValidations}
                cityValidations = {this.props.cityValidations}
                zipValidations = {this.props.zipValidations}
                dwollaCustomer = {this.props.dwollaCustomer}
              />
            )
            break;
          case 2:
            return(
              <Dob
                dispatchSetDob={this.props.dispatchSetDob}
                dispatchSetPageX={this.props.dispatchSetPageX}
                dwollaCustomer={this.props.dwollaCustomer}
                callbackClose={Actions.landingView}
              />
            )
            break;
          case 3:
            return(
              <SSN
                dispatchSetSSN={this.props.dispatchSetSSN}
                dispatchSetPageX={this.props.dispatchSetPageX}
                dispatchSetSSNValidations={(text) => this.props.dispatchSetSSNValidations(Validators.validateSSN(text))}
                ssnValidations = {this.props.ssnValidations}
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
    }
    if (this.props.startIav != "" && this.props.startMain == false && this.props.startVerifyMicroDeposit == false){
      console.log("IAV: " + this.props.startIav);

      return(
        <Iav
          listen={this.props.listen}
          stopListening={this.props.stopListening}
          activeFirebaseListeners={this.props.activeFirebaseListeners}
          newUser={this.props.newUser}
          startIav={this.props.startIav}
          startMain={this.props.startMain}
          dispatchSetLoading={this.props.dispatchSetLoading}
          dispatchSetDoneLoading={this.props.dispatchSetDoneLoading}
          />
      )
    }
    if(this.props.startMain == true){
      //Actions.MainViewContainer()
      return(
        <LoadingView />

      )
    }
    if(this.props.retry){
      return (
        <RetryModal dispatchSetRetry={this.props.dispatchSetRetry}
        dispatchSetPageX={this.props.dispatchSetPageX}/>
      )
    }
    if(this.props.document){
      return (
        <DocumentModal dispatchSetDocument={this.props.dispatchSetDocument}/>
      )
    }
    if(this.props.suspended){
      return (
        <SuspendedModal dispatchSetSuspended={this.props.dispatchSetSuspended}/>
      )
    }
    if (this.props.startVerifyMicroDeposit == true){
      return(
          <VerifyMicrodeposit
          newUser={this.props.newUser}
          />
      )
    }
  }
};

export default BankOnboardingView;

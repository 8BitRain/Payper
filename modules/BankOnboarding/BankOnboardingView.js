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


//styles
import backgrounds from "./styles/backgrounds";
import containers from "./styles/containers";
import typography from "./styles/typography";
import colors from '../../styles/colors';



var Mixpanel = require('react-native-mixpanel');

class OnTest extends React.Component {
  constructor(props) {
    super(props);

    //Attempt that causes looping of code in webview
    this.injectedJS = 'var iav_token = ' + "'" + this.props.startIav + "'" + ';' + ' $( document ).ready(function() { generateIAVToken()});';

    //Attempt that has no effect (white blank screen)
    //this.injectedJS = 'var iav_token = ' + "'" + this.props.startIav + "'" + ';' + ' window.onload = function() { dwolla.configure(\'sandbox\'); //Enable the falling log to see iav_token passed $div = $(\'<div />\'); $div.text(JSON.stringify("Value of iav_token: " + iav_token)); $(\'#logs\').append($div); dwolla.iav.start(iav_token, { container: \'iavContainer\', microDeposits: false, fallbackToMicroDeposits: true}, function(err, res) {console.log(\'Error: \' + JSON.stringify(err) + \' -- Response: \' + JSON.stringify(res)); $div.text(JSON.stringify(err)); $div.text(JSON.stringify(res)); $(\'#logs\').append($div);});});';

    //Attempt that in sync with having the user click a button, loads the IAV properly
    //this.injectedJS = 'var iav_token = ' + "'" + this.props.startIav + "'" + ';'
    this.numInjectedJSCalls = 0;

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
       source={{uri: 'https://www.getcoincast.com/iav'}} injectedJavaScript={this.injectedJS}
       style={{marginTop: 20}}
     />
    );
  }
}

class OnBoardingSummaryTest extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };
     this.firstName ='';
     this.lastName;
     this.email;
     this.ipadress;
     this.type;
     this.address1;
     this.address2;
     this.city;
     this.state;
     this.postalCode;
     this.dob;
     this.ssn;
     this.phone;
     this.token1 = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZjY2YzZDBhNTU1N2JiNjg1MzNjMDUyZWUwY2U4Y2U2Njc2MTY0MTIifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWJhc2UtY29pbmNhc3QiLCJhdWQiOiJmaXJlYmFzZS1jb2luY2FzdCIsImF1dGhfdGltZSI6MTQ2ODUxMzQ1MSwidXNlcl9pZCI6ImdtdXVpU2NoVTZXSHpHYko0TXNTbk1ETVd1QjIiLCJzdWIiOiJnbXV1aVNjaFU2V0h6R2JKNE1zU25NRE1XdUIyIiwiaWF0IjoxNDY4NTEzNDUyLCJleHAiOjE0Njg1MTcwNTIsImVtYWlsIjoiYXRpamFpdGhAd2lzYy5lZHUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXRpamFpdGhAd2lzYy5lZHUiLCJhdGlqYWl0aEB3aXNjLmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.NTwDTqJP2PtO9gfMdN_K8h4R9tiOkcFP9wlbxwFZzGjQWjPa5CoKt556okG1IXzNtCZ8AIRcxL-X2pTxgfM0bF6-haHstAmUktWiMnKgjPUfcE__KzcsUQtNDffUEW_3Yxuqeih7pEw9ADArwWxOPELhSDF-fGZD7ZF7UtiOeDZDj6N0QlQOKG5j0txpZJ1b_OCYNYCjzud9_okH_I7sBycEEs5XZlYidZTbWbmT2u_H_3ulbL3CI3oTzuVkraXOD9L-TiYTw_Jie43or2-_a8CevO426waWJZdV-RlBra333onJuPibc_1SufbhhoC0lDJbgmtGgpa6sFQ1Q283HA';
     this.token2 = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZjY2YzZDBhNTU1N2JiNjg1MzNjMDUyZWUwY2U4Y2U2Njc2MTY0MTIifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWJhc2UtY29pbmNhc3QiLCJhdWQiOiJmaXJlYmFzZS1jb2luY2FzdCIsImF1dGhfdGltZSI6MTQ2ODUxMzc5NSwidXNlcl9pZCI6ImJLUHdQWjEzM2hRallJV3c2cjREUG1QVnc4cDIiLCJzdWIiOiJiS1B3UFoxMzNoUWpZSVd3NnI0RFBtUFZ3OHAyIiwiaWF0IjoxNDY4NTEzNzk1LCJleHAiOjE0Njg1MTczOTUsImVtYWlsIjoiaWVhaG9nZ2hvQHdpc2MuZWR1IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImllYWhvZ2dob0B3aXNjLmVkdSIsImllYWhvZ2dob0B3aXNjLmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.er53keRDIpj3bU1SqSuC20RJH7EuvuK3fSZ8xQRIr8sg_oT83KSutjMxc4e22iuvlTsmmW7uY8cqb6tuEnM9O-XmRqGcSWldZwAERs4xCKCA3u1QIee_qyYd3KyOJP1Jg2AQNVVpS5rgZhI_kDUNl3RDxFvD_taIbs7vNG6XRmalv0D0fg374Ek9hijQf3vlaFDuKGwwLbJPuumZijOeORc4YSd7kmQglTel51IqiCRgandQlAh5cQChXjbQTtfUuPLOxZQ-ZNAMxLLfTqvu5G5KAMXyuhqsgOnzkeaRTHTM9aG6HQFYOyuj17QI3FBVNsW8FK6laGzBHEHSRui_Xg';
     this.token = '';
     this.injectedJS = '';


     Async.get('session_token', (token) => {
       this.token = token;
       console.log("Token: " + token);
     });
   //Header props
   this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": false,
        "settingsIcon": true,
        "closeIcon": false
      },
      index: 0,
      numCircles: 6
    };
}
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   initiateIAV(){
     /*Grab IAV token for specic customer*/
      //Ping the server with firebase token
        //Server will respond with iav_token
      //Inject token into webview
      //Process
      //On Callback handle what occurs in webview

      var data = {
        token: this.token
      };

      var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/utils/getIAV';
      fetch(url, {method: "POST", body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((responseData) => {
        //AsyncStorage.setItem("@Store:session_key", token);
        console.log(responseData.token);
        this.injectedJS = 'var iav_token = ' + responseData;
        console.log(this.injectedJS);
        this.props.dispatchSetIav(responseData.token);
      })
      .done();


   }

   submitUserCredentials(){
     console.log("Submitting user credentials");
     console.log(this.firstName);
     console.log(this.lastName);
     console.log(this.email);
     console.log(this.address1);
     console.log(this.city);
     console.log(this.state);
     console.log(this.postalCode);
     console.log(this.dob);
     console.log(this.ssn);
     console.log(this.phone);

     var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/create';

     var data = {
       firstName: this.firstName,
       lastName: this.lastName,
       email: this.email,
       address: this.address1,
       city: this.city,
       state: this.state,
       zip: this.postalCode,
       dob: this.dob,
       ssn: this.ssn,
       phone: this.phone,
       token: this.token
     };


     console.log(data);

     fetch(url, {method: "POST", body: JSON.stringify(data)})
     .then((response) => response.json())
     .then((responseData) => {
       //AsyncStorage.setItem("@Store:session_key", token);
       console.log(responseData);
     })
     .done();
   }

    submitFundingSource(){
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
    }

   onThankYouPress() {
     Actions.ThankYouView();
   }

   /*firebase.database().ref('/paymentFlow/' + uid + "/in").on('value', (snapshot) => {
     console.log("Exit webview");
   });*/



   render() {
     return (
       <Animated.View style={[containers.contentContainer, {opacity: this.animationProps.fadeAnim, backgroundColor: colors.darkGrey}]}>
       {console.log("Props Value: " + this.props.startIav)}
       <View style={{alignItems:"center"}}>

          {/*Legal First name, Legal Last name adress (associated with your bank account)*/}
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.firstName = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"First"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.lastName = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Last"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.email = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"email"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.address1 = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"address"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.city = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"city"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.state = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"state"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.postalCode= text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"zip"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.dob = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"dob"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.ssn = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"ssn"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.phone = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"phone"}/>
         <Button onPress={() => this.submitUserCredentials()}><Text style={typography.general}>Create Verified Customer</Text></Button>


         {/*Where are we storing the user?
         //Should we save a user's id within the app, grab their customerURL?
         //Storage -> AsyncStorage
         //Firebase does auth and login ask for a session token
         //Send token to the server

         //Signing up for the first time
         //Already existing within the app.*/}


         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.routing = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Routing #"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.account = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Account #"}/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.type = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Type (checking or savings)"} autoCapitalize="none"/>
         <TextInput style={[{height:40}, typography.general]}onChangeText={(text) => {this.name = text;}} placeholderFontFamily="Roboto" placeholderTextColor="white" placeholder={"Name"} autoCapitalize="none"/>
         <Button onPress={() => this.submitFundingSource()}><Text style={typography.general}>Add routing information to customer</Text></Button>
         <Button onPress={() => this.removeFundingSource()}><Text style={typography.general}>Remove funding informatino</Text></Button>
          <Button onPress={() => this.initiateIAV()}><Text style={typography.general}>Grab IAV Token</Text></Button>


       </View>

       </Animated.View>
     );
   }
 }


const BankOnboardingView = React.createClass({
  render() {
    if(this.props.startIav == ''){
      return(
        <OnBoardingSummaryTest  startIav={this.props.startIav} dispatchSetIav={this.props.dispatchSetIav}/>
      )
    } else {
      console.log("IAV: " + this.props.startIav);
      return(
        <OnTest startIav={this.props.startIav}/>
      )
    }
  }
});

export default BankOnboardingView;

import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/Header/Header.js';



//styles
import backgrounds from "./styles/backgrounds";
import containers from "./styles/containers";
import typography from "./styles/typography";
import colors from '../../styles/colors';



var Mixpanel = require('react-native-mixpanel');


const injectScript = `
var dwolla = require('dwolla-v2');

 //see dwolla.com/applications for your client id and secret
 var client = new dwolla.Client({id: 'a250b344-844d-41e1-80c0-211f196e50a7', secret: 'QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP'});

 //generate a token on dwolla.com/applications
 var accountToken = new client.Token({access_token: "boyUEt648u76lIsXqws17kMVBSp9k1UTnwY675mglaF8hcxQ5Q"});

 alert("FISH");
 accountToken
   .get('customers', { limit: 10 })
   .then(function(res) {
     console.log(res.body);
   });
`;

class OnBoardingSummaryTest extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };

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
     //var dwolla = require('dwolla-v2');

      //see dwolla.com/applications for your client id and secret
      /*var client = new dwolla.Client({id: 'a250b344-844d-41e1-80c0-211f196e50a7', secret: 'QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP'});

      //generate a token on dwolla.com/applications
      var accountToken = new client.Token({access_token: "boyUEt648u76lIsXqws17kMVBSp9k1UTnwY675mglaF8hcxQ5Q"});

      accountToken
        .get('customers', { limit: 10 })
        .then(function(res) {
          console.log(res.body);
        });*/


   }

   onThankYouPress() {
     Actions.ThankYouView();
   }

   dwollaTestData(){
     console.log("Dwolla Test Data");

   }

   onBridgeMessage(message){
   const { webviewbridge } = this.refs;

   switch (message) {
     case "hello from webview":
       webviewbridge.sendToBridge("hello from react-native");
       break;
     case "got the message inside webview":
       console.log("we have got a message from webview! yeah");
       break;
   }
 }



   /*<Animated.View style={[containers.contentContainer, {opacity: this.animationProps.fadeAnim, backgroundColor: colors.darkGrey}]}>
   <View style={{alignItems:"center"}}>
    <Button onPress={this.dwollaTestData()}><Text style={typography.general}>Test Dwalla</Text></Button>
     <Text style={typography.general}>First Name</Text>
     <Text style={typography.general}>Last Name</Text>
     <Text style={typography.general}>Email</Text>
     <Text style={typography.general}> IP Address</Text>
     <Text style={typography.general}>Type (personal or business)</Text>
     <Text style={typography.general}>Address 1</Text>
     <Text style={typography.general}>Address 2</Text>
     <Text style={typography.general}>City</Text>
     <Text style={typography.general}>State</Text>
     <Text style={typography.general}>Postal Code</Text>
     <Text style={typography.general}>Date of Birth</Text>
     <Text style={typography.general}>SSN</Text>
     <Text style={typography.general}>Phone</Text>
   </View>

   </Animated.View>*/




   render() {
     return (
       <WebView injectedJavaScript={injectScript} source={{uri: "http://localhost:3000"}} />
     );
   }
 }


const BankOnboardingView = React.createClass({
  render() {
    return(
      <OnBoardingSummaryTest  />
    );
  }
});

export default BankOnboardingView;

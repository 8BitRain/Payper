import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, WebView, Linking} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';


import * as Async from '../../../helpers/Async';
import * as Init from '../../../_init';

//styles
import backgrounds from "../styles/backgrounds";
import containers from "../styles/containers";
import typography from "../styles/typography";
import colors from '../../../styles/colors';



var Mixpanel = require('react-native-mixpanel');

class VerifyMicrodeposit extends React.Component {
  constructor(props) {
    super(props);

    this.amount1;
    this.amount2;

  }

  componentWillMount() {
    // Initialize the app
    //listen
  }

  componentWillUnmount() {
    // Disable Firebase listeners
    //this.props.stopListening(this.props.activeFirebaseListeners);
  }

  submit(){
    data = {
      amount1: this.amount1,
      amount2: this.amount2,
      token: this.props.newUser.token
    };
    Init.sendMicrodeposits(data, function(microdeposits_sent){
      console.log("microdeposits_sent?: " + microdeposits_sent);
      //Go to main screen
      Actions.MainViewContainer();
      });
  }

  render() {
      return(
        <View style={[containers.container, backgrounds.email]}>
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {marginTop: 40}]}>Verify Microdeposits </Text>
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}>Dwolla  has posted Microdeposits to your bank account. Enter the two amounts to start sending money with Payper</Text>
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}> Amount 1 </Text>
          <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} onChangeText={(text) => {this.amount1 = text;}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto"   />
          <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, typography.marginBottom]}> Amount 2 </Text>
          <TextInput style={[typography.textInput, typography.marginSides, typography.marginBottom]} onChangeText={(text) => {this.amount2 = text;}} autoCorrect={false} autoFocus={true} autoCapitalize="none" placeholderFontFamily="Roboto"   />
          <Button onPress={()=> {this.submit()}}><Text style={[typography.marginSides, typography.marginBottom]}>Submit</Text></Button>
        </View>
      );
  }
}

export default VerifyMicrodeposit;

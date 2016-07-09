import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Firebase from "../../services/Firebase";

// Stylesheets
import containers from "../../styles/containers";
import backgrounds from "../../styles/backgrounds";
import typography from "../../styles/typography";
import colors from "../../styles/colors";

import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";

var dimensions = Dimensions.get('window');

class SignInView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      signedIn: false,
    }

    this.arrowNavProps = {
      left: false,
      right: true,
    }

    AsyncStorage.getItem('@Store:session_key').then((key) => {
      console.log("session_key: " + key);
    }).done();
  }

  signInWithEmail() {
    Firebase.signInWithEmail({email: this.state.email, password: this.state.password});
  }

  componentWillMount() {
    Firebase.signInWithKey(function(signedIn) {
      if (signedIn) {
        this.setState({signedIn: signedIn});
        Actions.CreatePaymentViewContainer();
      } else {
        console.log("signedIn: " + signedIn);
      }
    }.bind(this));
  }

  render() {

    switch (this.state.signedIn) {
      case (true):
        return(
          <View>
          </View>
        );
      break;
      case (false):
        return (
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.white}}>

            <View style={{flex: 0.2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'Roboto', fontSize: 45, fontWeight: '300', color: colors.darkGrey, textAlign: 'center'}}>Coincast</Text>
            </View>

            <View style={{flex: 0.4, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.darkGrey}}>
              <Text style={{fontFamily: 'Roboto', fontSize: 30, fontWeight: '300', textAlign: 'center', color: colors.white}}>
                Sign In
              </Text>
              <TextInput
                style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
                placeholder={"Email"}
                autoFocus={true}
                autocapitalize={false}
                keyboardType={"email-address"}
                onChangeText={(text) => this.setState({email: text}) } />
              <TextInput
                style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
                placeholder={"Password"}
                autoFocus={true}
                secureTextEntry
                onChangeText={(text) => this.setState({password: text}) } />
            </View>

            { /* Filler */ }
            <View style={{flex:0.4, backgroundColor: colors.darkGrey}}></View>

            { /* Arrow nav buttons */ }
            <View style={{position: 'absolute', bottom: 220, left: 0, right: 0}}>
              <ArrowNav
              arrowNavProps={this.arrowNavProps}
              callbackRight={() => { this.signInWithEmail() }} />
            </View>
          </View>
        );
      break;
    }
  }
}


export default SignInView;

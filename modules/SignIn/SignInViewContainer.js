import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  ShareDialog,
  AccessToken
} = FBSDK;


// Stylesheets
import colors from "../../styles/colors";
import styles from '../../styles/SignIn/Generic';

// Custom components
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";
import Loading from "../../components/Loading/Loading";


var dimensions = Dimensions.get('window');

class SignInView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
      doneLoading: false,
    }

    this.arrowNavProps = {
      left: false,
      right: true,
    }
  }


  signInWithEmail() {
    var _this = this;  //Is this line necessary?
    this.setState({loading: true});
    Init.signInWithEmail({email: this.state.email, password: this.state.password}, function(signedIn) {
      _this.setState({doneLoading: true});
    });
  }

  //Sign in for facebook
  signInWithCredential(){
    this.setState({loading: true});

  }


  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.white}}>
        {/*Change payment back to flex .2*/}
        <View style={{flex: 0.1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
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

        <LoginButton
        publishPermissions={["publish_actions"]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("login has error: " + result.error);
            } else if (result.isCancelled) {
              alert("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  alert(data.accessToken.toString())

                }
              )
            }
          }
        }
        onLogoutFinished={() => alert("logout.")}/>
      </View>
    );
>>>>>>> 4a6be2d0ae2b1cb689846ee6861cf003b1013267
  }
}


export default SignInView;

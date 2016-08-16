// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";

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

    this.MAX_ATTEMPTS = 7;

    this.state = {
      email: "",
      password: "",
      loading: false,
      doneLoading: false,
      signInSuccess: false,
      attempts: [],
      attemptLimitReached: false,
      remainingAttempts: this.MAX_ATTEMPTS,
    }

    this.arrowNavProps = {
      left: false,
      right: true,
    }
  }


  signInWithEmail() {
    const _this = this;

    // Increment sign-in attempt count for this email
    if (typeof this.state.attempts[this.state.email] != 'number') this.state.attempts[this.state.email] = 1;
    else this.state.attempts[this.state.email]++;

    // Update remainingAttempts count
    // this.setState({ remainingAttempts: this.MAX_ATTEMPTS - this.state.attempts[this.state.email] });

    console.log("Sign in attempts:", this.state.attempts);
    console.log("Remaining attempts:", this.MAX_ATTEMPTS - this.state.attempts[this.state.email]);

    if (this.MAX_ATTEMPTS - this.state.attempts[this.state.email] == 0) {
      console.log("%cToo many sign in attempts.", "color:red;font-weight:900;");
      this.setState({ attemptLimitReached: true });
    }
  }


  _getAttemptLimitReachedMessage() {
    return(
      <Text>
        { "You have reached your sign in attempt limit. We sent a password reset email to " + this.state.email + "." }
      </Text>
    );
  }


  _getRemainingAttemptsMessage() {
    return(
      <Text>
        { "You have " + this.state.remainingAttempts + " sign in attempts remaining." }
      </Text>
    );
  }


  render() {
    if (this.state.loading) {
      return(
        <Loading
          complete={this.state.doneLoading}
          success={this.state.signInSuccess}
          msgSuccess={"Welcome!"}
          msgError={"Sign in failed"}
          msgLoading={"Signing in"}
          successDestination={() => Actions.MainViewContainer()}
          errorDestination={() => { this.setState({loading: false}) }} />
      );
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.white}}>

          <View style={{backgroundColor: colors.accent, paddingBottom: 10, flex: 0.12, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Roboto', fontSize: 40, fontWeight: '300', color: colors.white, textAlign: 'center'}}>Payper</Text>
          </View>

          <View style={{flex: 0.7, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.label}>
              Sign In
            </Text>

            <TextInput
              style={styles.input}
              placeholder={"Email"}
              defaultValue={this.state.email}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={"email-address"}
              onChangeText={(text) => this.setState({email: text}) }
              onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.refs.password.focus() }} />

            <TextInput
              ref="password"
              style={styles.input}
              placeholder={"Password"}
              secureTextEntry
              onChangeText={(text) => this.setState({password: text}) }
              onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.signInWithEmail() }} />

            { /* If sign in attempt limit has been reached, prompt user to reset password */
              (this.state.attemptLimitReached)
                ? this._getAttemptLimitReachedMessage()
                : (this.state.remainingAttempts <= 3)
                  ? this._getRemainingAttemptsMessage()
                  : null
            }

            { /* Arrow nav buttons */ }
            <View>
              <ArrowNav
                dark
                arrowNavProps={this.arrowNavProps}
                callbackRight={() => { this.signInWithEmail() }} />
            </View>
          </View>

          { /* Filler */ }
          <View style={{flex:0.18}}></View>
        </View>
      );
    }
  }
}


export default SignInView;

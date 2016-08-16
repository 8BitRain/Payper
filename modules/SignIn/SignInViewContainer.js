// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, AsyncStorage, TouchableHighlight } from "react-native";
import Button from "react-native-button";
import { Reducer, Router, Actions } from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";

// Stylesheets
import colors from "../../styles/colors";
import styles from '../../styles/SignIn/Generic';
const dimensions = Dimensions.get('window');

// Custom components
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";
import Loading from "../../components/Loading/Loading";

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

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
      resetEmailSentTo: false,
    }

    this.arrowNavProps = {
      left: false,
      right: true,
    }

    this.input = {
      email: "",
      password: "",
    }
  }


  signInWithEmail() {
    const _this = this;

    // If a reminder email has been sent the user is now trying to sign in with
    // a different email, get rid of any rendered reminder email messages
    if (this.input.email != this.state.email) {
      this.setState({
        resetEmailSentTo: false,
        attemptLimitReached: false,
      });
    }

    // Save email and password to state
    // TODO: Validate here
    this.setState({ email: this.input.email, password: this.input.password }, () => {

      // Increment sign-in attempt count for this email
      if (typeof this.state.attempts[this.state.email] != 'number') this.state.attempts[this.state.email] = 1;
      else this.state.attempts[this.state.email]++;

      // Update remainingAttempts count
      this.setState({ remainingAttempts: this.MAX_ATTEMPTS - this.state.attempts[this.state.email] });

      console.log("Sign in attempts:", this.state.attempts);
      console.log("Remaining attempts:", this.MAX_ATTEMPTS - this.state.attempts[this.state.email]);

      // If user is out of attempts, set attemptLimitReached to true
      if (this.MAX_ATTEMPTS - this.state.attempts[this.state.email] <= 0) {
        console.log("%cToo many sign in attempts.", "color:red;font-weight:900;");
        this.setState({ attemptLimitReached: true });
      }

      // Otherwise, sign the user in
      else {
        this.setState({ loading: true });
        Init.signInWithEmail({ email: this.state.email, password: this.state.password }, (success) => {
          this.setState({ doneLoading: true, signInSuccess: success });
        });
      }

    });
  }


  _resetPassword() {
    this.setState({ resetEmailSentTo: this.state.email });
    Firebase.sendPasswordResetEmail(this.state.email, function(success) {
      console.log("Password reset email sent:", success);
    });
  }


  _getAttemptLimitReachedMessage() {
    return(
      <View style={{width: dimensions.width * 0.85, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{padding: 10, textAlign: 'center'}}>
          { (this.state.resetEmailSentTo)
              ? "We sent password reset instructions to " + this.state.email
              : "For security reasons, we've limited the number of times you can attempt to sign in." }
        </Text>

        { /* Reset password button */ }
        <TouchableHighlight
          style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, backgroundColor: (this.state.resetEmailSentTo) ? colors.alertGreen : colors.icyBlue, paddingTop: 7.5, paddingBottom: 10, paddingLeft: 15, paddingRight: 15,}}
          onPress={() => this._resetPassword()}
          underlayColor={(this.state.resetEmailSentTo) ? colors.alertGreen : colors.icyBlue}
          activeOpacity={0.7}>

          <View>
            <Entypo style={{textAlign: 'center'}} name={(this.state.resetEmailSentTo) ? "check" : "mail"} size={20} color={colors.white} />
            <Text style={{fontSize: 14, fontWeight: '600', color: colors.white, textAlign: 'center'}}>
              { (this.state.resetEmailSentTo)
                  ? "Send another email"
                  : "Reset your password" }
            </Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  }


  _getRemainingAttemptsMessage() {
    return(
      <View style={{width: dimensions.width * 0.8, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{paddingTop: 10, textAlign: 'center'}}>
          { (this.state.remainingAttempts == 1)
              ? "You have " + this.state.remainingAttempts + " sign in attempt remaining."
              : "You have " + this.state.remainingAttempts + " sign in attempts remaining."
          }
        </Text>
      </View>
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
              onChangeText={(text) => this.input.email = text}
              onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.refs.password.focus() }} />

            <TextInput
              ref="password"
              style={styles.input}
              placeholder={"Password"}
              secureTextEntry
              onChangeText={(text) => this.input.password = text}
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
